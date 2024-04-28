import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';
import mainrouter from './main/main.router';
import usersrouter from './users/users.router';
import projectsrouter from './projects/projects.router';
import { readFileSync } from "fs";

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


async function init() {
    const password = 'password';
    const secretKey = generateSecretKey();
    console.log("secretKey")
    const sk = "regret enforce expect gloom beach orange mixture dinosaur toss leave frost more please penalty gain vivid test coconut marble shine basket defense pumpkin cannon"
    console.log(secretKey);
        const wallet = await generateWallet({
        secretKey: sk,
        password,
    });

    console.log(wallet.configPrivateKey)
    console.log(wallet.encryptedSecretKey)
}
init();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});