import OAuth2Server from 'oauth2-server';
import { Request, Response } from 'oauth2-server';
import model from '../model/oauth2model.js';

const oauth = new OAuth2Server({
  model: model, // specify your model file
});

export default oauth;
