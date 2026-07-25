import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

const client = new MongoClient(url);

let db;

const connectDB = async () => {
    try {
        console.log("Mongo URL:", process.env.MONGODB_URL);

        await client.connect();

        console.log("✅ MongoDB Connected");

        db = client.db("lead");

        return db;

    } catch (err) {
        console.error("MongoDB Error:", err);
        throw err;
    }
};

export { connectDB };