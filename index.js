import express from "express";
import cors from "cors";
import { connectDB } from "./dbconfig.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: "https://lead-nine-beige.vercel.app",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser())
let db;
const PORT = process.env.PORT || 4000;

(async () => {
    db = await connectDB();
})();

app.post("/lead", async (req, res) => {

    const { name, email, phone, service, budget, description } = req.body;

    if (!name || !email || !phone || !service || !budget || !description) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const lead = {
        id: Date.now(),
        name,
        email,
        phone,
        service,
        budget,
        description
    };

    await db.collection("leadData").insertOne(lead);

    res.status(201).json({
        success: true,
        message: "Lead Added Successfully",
        lead
    });

});
app.post("/admin", async (req, res) => {
    try {
const boss = "Boss";
const Password = "boss123";
        const { Boss, password } = req.body;

        if (Boss === boss && password === Password) {

            const token = jwt.sign(
                {
                    Boss: boss,
                    password: Password
                },
                "mySecretKey",
                {
                    expiresIn: "1h"
                }
            );
            return res.status(200).json({
                success: true,
                message: "Login Successful",
                token
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
});



function verifyToken(req, res, next){
 console.log("cookies test",req.cookies)
    const token = req.cookies['token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token Missing"
        });
    }

    try {

        const decoded = jwt.verify(token, "mySecretKey",(error,decoded)=>{
            console.log("decodede",decoded)
        });

    

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

app.get("/adminHome", verifyToken, async (req, res) => {
    console.log("cookies test",req.cookies)

    const leads = await db
        .collection("leadData")
        .find()
        .toArray();

    res.json(leads);

});


export default app;