require('dotenv').config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = "travel-nest";

let cachedClient = null;
let cachedDb = null;

async function connectToDB() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  console.log("MongoDB connected");
  return { client, db };
}

module.exports = connectToDB;
