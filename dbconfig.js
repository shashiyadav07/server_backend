import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

const client = new MongoClient(url);

let db;

const connectDB = async () => {
    try {

        await client.connect();

        console.log("✅ MongoDB Connected Successfully");

        db = client.db("lead");

        return db;

    } catch (err) {

        console.log("❌ MongoDB Connection Failed");
        console.log(err);

    }
};

export { connectDB };