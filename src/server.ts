import { WebSocket, WebSocketServer } from "ws";
import express, { query } from 'express';
import bodyParser from 'body-parser';
import oauth from './api/auth_manager/oauth2server.js'; // import your oauth server instance
import { Request, Response, Token } from 'oauth2-server';
import crypto from 'crypto';

import { createCollection } from './util/db_manager/mongodbcollection.js';
import { CollectionManager } from './util/db_manager/mongodbmanager.js';
import config from './configuration/config.js';
import { request } from 'http';
import { Console } from 'console';

import http from 'http';
import { QueueManager } from "./api/order_manager/queue_manager/queuemanager.js";
import { matchingAlgo } from "./api/order_manager/matching_engine/matchineengine.js";

import url from 'url';
import { IncomingMessage } from 'http';

let liveConnections = {}
const queuemanager = new QueueManager([] ,liveConnections);

const dbUrl = config.dbUrl
const dbName = config.dbName
const clientCollection =await createCollection(dbUrl ,dbName,"client");
const clientCollectionManager = new CollectionManager(clientCollection);

const userCollection =await createCollection(dbUrl ,dbName,"user");
const userCollectionManager = new CollectionManager(userCollection);

const userResourceCollection =await createCollection(dbUrl ,dbName,"user_resource");
const userResourceCollectionManager = new CollectionManager(userResourceCollection);


const clientId = crypto.randomBytes(16).toString('hex');
const clientSecret = crypto.randomBytes(32).toString('hex');
const newClient = {
  id: clientId,
  clientSecret: clientSecret,
  name: "LedgerEdge",
  redirectUris: "",
  grants: ['password', 'refresh_token']
};


await clientCollectionManager.addItem(newClient);

const app = express();


const wss = new WebSocketServer({port :3002});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Websocket for user interaction\
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const parameters = url.parse(req.url, true);
  const authToken = parameters.query.token;

  const request = new Request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 0,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization' : "Bearer "+authToken
    },
    query: {},
    method: 'GET'
  });

  const response = new Response({});

  oauth
    .authenticate(request, response)
    .then(async (token: any) => {
      liveConnections[token.user.id] =ws;
      const status = {
        status : true 
      };
      ws.send( JSON.stringify(status));
    })
    .catch((err: any) => {
      console.log(err);
      const status = {
        status : false ,
        cause : 'auth_fail'
      };
      ws.send( JSON.stringify(status));
      ws.close();
    });

  ws.on('message', function incoming(message){
    console.log(message);
  });
});


//Auth endpoints
app.post('/api/auth/user/signup', (req, res) => {
  console.log(req.body);
  const { username , password ,firstname ,lastname } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'usertName and userPassword are required' });
  }

  const userId = crypto.randomBytes(16).toString('hex');
  
  const newUser = {
    id: userId,
    username: username,
    firstname : firstname,
    lastname : lastname,
    password: password
  };
  
  const newUserResource = {
    id: userId,
    username: username,
    data : {
      wallet : {usd : 1000 , btc : 0},
      transaction : { ongoing : [] ,  filled : [] } ,
      alerts : []
    }
  };

  userResourceCollectionManager.addItem(newUserResource);
  userCollectionManager.addItem(newUser);

  res.status(201).json({
    user_id: userId
  });
});


app.post('/api/auth/signin', async (req, res) => {


  const { username , password } = req.body;
  
  var details = {
    username: username,
    password: password ,
    grant_type: 'password',
    client_id : clientId,
    client_secret: clientSecret
    };


  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 0,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br'
    },
    query : {},
    body : details
  };


  const request = new Request(requestOptions);
  const response = new Response(res);

  oauth
  .token(request, response)
  .then(async (token) => {

    const userdata = await userCollectionManager.getItemByName(username);

    console.log(userdata);
    token.user["username"] = username;
    token.user["firstname"] = userdata['firstname'];
    token.user["lastname"] = userdata['lastname'];
    res.json(token);
  })
  .catch((err) => {
    res.status(err.code || 500).json(err);
  });



  
});


//Trading data

app.post('/api/user/ordersubmission', async (req, res) => {

  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then(async (token) => {
  
      const orderid = crypto.randomBytes(32).toString('hex');
      const username = token.user.username;
      const userid = token.user.id;
      
      const additionjson = {'id' : orderid , 'username' : username , 'userid' : userid , 'percentage' : 0 , 'filled' : false}
      
      const data = {... additionjson,...req.body}
      queuemanager.addOrder(data);

      res.json("Sucessfull");
    })
    .catch((err) => {
      console.log(err);
      res.status(err.code || 500).json(err);
    });
});


app.get('/api/user/wallet', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then(async (token) => {
      const userid = token.user.id;
      const userdata =await userResourceCollectionManager.getItemById(userid , 'data.wallet');
      const wallet = userdata[0];
      const data = {... token.user,...wallet}

      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.code || 500).json(err);
    });
});


app.get('/api/user/transactions/ongoing', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then(async (token) => {
      const userid = token.user.id;
      const userdata =await userResourceCollectionManager.getItemById(userid , 'data.transaction.ongoing');
      const ongoing = userdata[0];
      const data = {... token.user,...ongoing}

      res.json(data);
    })
    .catch((err) => {
      res.status(err.code || 500).json(err);
    });
});

app.get('/api/user/transactions/filled', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then(async (token) => {
      const userid = token.user.id;
      const userdata =await userResourceCollectionManager.getItemById(userid , 'data.transaction.filed');
      const filled = userdata[0];
      const data = {... token.user,...filled}

      res.json(data);
    })
    .catch((err) => {
      res.status(err.code || 500).json(err);
    });
});


app.get('/api/user/alerts', async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then(async (token) => {
      const userid = token.user.id;
      const userdata = await userResourceCollectionManager.getItemById(userid , 'data.alerts');

      const alerts = userdata[0];
      const data = {... token.user,...alerts}
      
      res.json(data);
      
      
    })
    .catch((err) => {
      res.status(err.code || 500).json(err);
    });
});


///////////////////////////////////////////////////
app.listen(3001, () => {
  console.log('Server started ');
});