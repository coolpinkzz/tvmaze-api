import { MongoClient, Db, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "tvmaze";

let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(mongoURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    return db;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("Disconnected from database");
  }
};
