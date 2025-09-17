import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client;
let db;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("MongoDB connected:", dbName);
}

export function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}