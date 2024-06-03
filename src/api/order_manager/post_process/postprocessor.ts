import { createCollection } from "../../../util/db_manager/mongodbcollection.js";
import { CollectionManager } from "../../../util/db_manager/mongodbmanager.js";
import { Order } from "../../model/order.js";
import config from "../../../configuration/config.js";

const dbUrl = config.dbUrl;
const dbName = config.dbName;

const userResourceCollection =await createCollection(dbUrl ,dbName,"user_resource");
const userResourceCollectionManager = new CollectionManager(userResourceCollection);

export async function postProcessor(order: Order ,liveConnections : any ){
    console.log(order);

    const alert = {};

    if (order.filled){

        await userResourceCollectionManager.deleteItemById(order.userid, {'data.transaction.ongoing' : order.id});
        await userResourceCollectionManager.addItem(order, {'id' : order.userid , 'path':'data.transaction.filled'});


        const item = order.item;
        const walletwrapper =await userResourceCollectionManager.getItemById(order.userid , 'data.wallet');
        const wallet = walletwrapper[0].data.wallet ;
        
        if(order.type == 'sell'){
        
            const newitemvalue = wallet[item] - order.quantity;
            const newusdvalue = wallet['usd'] + order.quantity*order.price;

            const itempath = 'data.wallet.'+item ;
            await userResourceCollectionManager.modifyItemById(order.userid, { [itempath] : newitemvalue} );
            await userResourceCollectionManager.modifyItemById(order.userid, { ['data.wallet.usd'] : newusdvalue} );


         }

        else{

            
            const newitemvalue = wallet[item] + order.quantity;
            const newusdvalue = wallet['usd'] - order.quantity*order.price;

            const itempath = 'data.wallet.'+item ;
            await userResourceCollectionManager.modifyItemById(order.userid, { [itempath] : newitemvalue} );
            await userResourceCollectionManager.modifyItemById(order.userid, { ['data.wallet.usd'] : newusdvalue} );
        }
        
        alert["topic"] = "Order Completed";
        alert["message"] ="Your  " +order.type + " is fully completed";
        alert["color"] = "alert-success";
        
       
    }
    else{
        const exist = await userResourceCollectionManager.modifyItemById(order.userid, {'percentage' : order.percentage} ,  {'data.transaction.ongoing' : order.id});
        if(!exist){
            await userResourceCollectionManager.addItem(order, {'id' : order.userid , 'path':'data.transaction.ongoing'});
            alert["topic"] = "Order Submitted";
            alert["message"] ="Your  " +order.type + " order is sucessfully submitted";
            alert["color"] = "alert-primary";}
            
        else{
            alert["topic"] = "Order Status";
            alert["message"] ="Your "+order.type +" is now "+ order.percentage + " completed";
            alert["color"] = "alert-info";}
            
        }
    
    


    userResourceCollectionManager.addItem(alert, {'id' : order.userid , 'path':'data.alerts'}).then(()=>{
        console.log("live connection " +liveConnections);

    if (order.userid in liveConnections) {
        const status = {onChanged : true };
        liveConnections[order.userid].send(JSON.stringify(status));
    } 
    })

    

}