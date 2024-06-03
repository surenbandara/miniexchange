import { getClient } from "./mongodbcliet.js";
import { Collection } from "mongodb";


export async function createCollection(url: string , databaseName: string, collectionName: string): Promise<Collection | null> {
    const client = getClient(url);
    const database = client.db(databaseName);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
    }

    // Check if the collection already exists
    const collections = await database.collections();
    const existingCollection = collections.find(coll => coll.collectionName === collectionName);
    if (existingCollection) {
        console.log(`Collection ${collectionName} already exists`);
        return existingCollection;
    }

    // If the collection doesn't exist, create it
    const collection = await database.createCollection(collectionName);
    console.log(`Collection ${collectionName} created`);
    return collection;
}
