import { MongoClient } from "mongodb";
export function getClient(url) {
    const client = new MongoClient(url);
    return client;
}
//# sourceMappingURL=mongodbcliet.js.map