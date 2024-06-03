import { createCollection } from '../../util/db_manager/mongodbcollection.js';
import { CollectionManager } from '../../util/db_manager/mongodbmanager.js';
import config from '../../configuration/config.js';
const dbUrl = config.dbUrl;
const dbName = config.dbName;
const clientCollection = await createCollection(dbUrl, dbName, "client");
const clientCollectionManager = new CollectionManager(clientCollection);
const userCollection = await createCollection(dbUrl, dbName, "user");
const userCollectionManager = new CollectionManager(userCollection);
const tokens = new Map();
const model = {
    getClient: async (clientId, clientSecret) => {
        const client = await clientCollectionManager.getItemById(clientId);
        if (client == null)
            return false;
        return {
            id: client.id,
            grants: client.grants,
        };
    },
    getUser: async (username, password) => {
        const user = await userCollectionManager.getItemByName(username);
        if (user == null)
            return false;
        return { id: user.id };
    },
    saveToken: async (token, client, user) => {
        tokens.set(token.accessToken, { ...token, client, user });
        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            client: client,
            user: user
        };
    },
    getAccessToken: async (accessToken) => {
        const token = tokens.get(accessToken);
        if (!token)
            return false;
        return token;
    },
    verifyScope: async (token, scope) => {
        // Simplified scope verification for demonstration
        return true;
    }
};
export default model;
//# sourceMappingURL=oauth2model.js.map