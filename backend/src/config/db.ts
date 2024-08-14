import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI as string; 
//const uri = "mongodb+srv://kenesibalazs:kenesimongo2024@kenesicluster1.f0lbpfm.mongodb.net/?retryWrites=true&w=majority&appName=KenesiCluster1"
const client = new MongoClient(uri);

async function connectToMongoDB(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    process.exit(1); 
  }
}

function getClient(): MongoClient {
  return client;
}

export { connectToMongoDB, getClient };
