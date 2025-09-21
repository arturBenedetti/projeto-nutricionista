"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongodb_1 = require("mongodb");
const env_1 = require("../config/env");
let db;
async function connectMongo() {
    if (!db) {
        const client = new mongodb_1.MongoClient(env_1.config.mongoUri);
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        db = client.db(env_1.config.dbName);
    }
    return db;
}
//# sourceMappingURL=mongo.js.map