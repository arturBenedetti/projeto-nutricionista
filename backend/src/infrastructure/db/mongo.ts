import { MongoClient, Db } from "mongodb";
import { config } from "../config/env";

let db: Db;

export async function connectMongo(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(config.mongoUri);
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db(config.dbName);
  }
  return db;
}