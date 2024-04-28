import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

import mainrouter from './main/main.router';
import usersrouter from './users/users.router';
import projectsrouter from './projects/projects.router';

dotenv.config();

const port = process.env.PORT || 5001;

const app: Express = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const mongourl = process.env.MDBURL || "";
export const mdb = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
mdb.connect().then(() => {
    console.log("[mongodb]: Connected to MongoDB");
}).catch((err) => {
    console.error("[mongodb]: Failed to connect to MongoDB", err);
});

app.get('/', (_: Request, res: Response) => {
    res.status(200).send("/");
})

app.use('/main', mainrouter);
app.use('/users', usersrouter);
app.use('/projects', projectsrouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});