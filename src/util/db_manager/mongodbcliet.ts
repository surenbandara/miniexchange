import { MongoClient } from "mongodb";

export function getClient(url : string ) {
    const client = new MongoClient(url);
    return client;
}
