import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const port = process.env.PORT || 5000;

const app: Express = express();
app.use(cors());
app.use(bodyParser.json({ limit: "24mb" }));

const mongourl = process.env.MDBURL || "";
const mongoclient = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
mongoclient.connect().then(() => {
    console.log("[mongodb]: Connected to MongoDB");
}).catch((err) => {
    console.error("[mongodb]: Failed to connect to MongoDB");
    console.error(err);
});

app.get("/", (req: Request, res: Response) => {
    res.send("/");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});