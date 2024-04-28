import { Request, Response } from 'express';
import { mdb } from '..';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet, StacksMainnet, StacksDevnet } from '@stacks/network';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { PushOperator } from 'mongodb';
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';

const network = new StacksTestnet();

import { v4 as uuidv4 } from 'uuid';
import CreateProjectSuperset from './project';
import { readFileSync } from 'fs';

const message = 'prove you own your wallet';

export const getprojects = async (req: Request, res: Response) => {
    // get projects where deployed is true
    const projects = await mdb.db("crowd").collection('projects').find({ deployed: true }).toArray();
    console.log("many");
    console.log(projects);

    res.status(200).json({ projects });
};

export const getprojectsbysearch = async (req: Request, res: Response) => {

    const { search } = req.query as any;

    const collection = mdb.db("crowd").collection("projects");
    const q = search.toString();

    const agg = [
        {
            $search: {
                index: "default", 
                text: {
                    query: q,
                    path: {
                        wildcard: "*"
                    }
                }
            }
        }, 
    ];

    const cursor = collection.aggregate(agg);
    const results = await cursor.limit(20).toArray();
    console.log(results);

    res.status(200).json({ projects: results });
}

export const getmyprojects = async (req: Request, res: Response) => {
    try {
        const publickey = req.headers['publickey'] as string as any;
        if (!publickey) {
            return res.status(400).json({ message: 'authentication failure' });
        }

        console.log("getting projects for", publickey);

        const userdata = await mdb.db("crowd").collection('users').findOne({ _id: publickey });
        console.log(userdata);

        const projects = await mdb.db("crowd").collection('projects').find({ creator: publickey }).toArray();
        console.log(projects);

        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getproject = async (req: Request, res: Response) => {
    try {
        const { projectuid } = req.query as any;
        if (!projectuid) {
            return res.status(400).json({ message: 'project not found' });
        }

        const projectdata = await mdb.db("crowd").collection('projects').findOne({ _id: projectuid });
        console.log(projectdata);

        res.status(200).json({ project: projectdata });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const startproject = async (req: Request, res: Response) => {
    console.log("!---------------------")
    const { projectname, ownerstacksaddress } = req.body;
    const publickey = req.headers['publickey'] as string as any;
    console.log(projectname, publickey);

    const projectuid = uuidv4().replace(/-/g, '');

    const result = await mdb.db("crowd").collection('projects').updateOne(
        { _id: projectuid as any,}, 
        { $setOnInsert: {
                creator: publickey,
                projectname,
                projectuid,
                createdat: new Date(),
                deployed: false,
                ownerstacksaddress
            } 
        }, 
        { upsert: true,}
    );
    console.log(result);

    const updateuser = await mdb.db("crowd").collection('users').updateOne(
        { _id: publickey },
        { $push: { projects: projectuid } } as any
    );
    console.log(updateuser);

    res.status(200).json({ projectuid });
}

export const uploadproject = async (req: Request, res: Response) => {
    console.log("!---------------------")
    try {
        const { 
            projectuid, projectpunchline, projectdescription, 
            projectdisplayimage, expiry, fundinggoal, milestones 
        }: CreateProjectSuperset = req.body;
    
        const publickey = req.headers['publickey'] as string as any;

        // deploy contract

        /* const txOptions = {
            contractName: projectuid,
            codeBody: readFileSync('./Campaign.clar').toString(),
            senderKey: 'be33449aaa5b1028e8a42e78be6bdbb9822fb4cfba6b68fbcde9931a112b0e4f',
            network,
            anchorMode: AnchorMode.Any,
        };

        const transaction = await makeContractDeploy(txOptions);
        console.log(transaction);
        const broadcastResponse = await broadcastTransaction(transaction, network);
        console.log(broadcastResponse);

        const txId = broadcastResponse.txid;
        console.log(txId); */
    
        // update the project with the rest of the data
    
        const result = await mdb.db("crowd").collection('projects').updateOne(
            { _id: projectuid as any },
            { $set: {
                    projectpunchline,
                    projectdescription,
                    projectdisplayimage,
                    expiry,
                    fundinggoal,
                    milestones,
                    amountraised: 0,
                    deployed: true,
                    backers: [],
                    deployedcontract: `ST3Q0RC31AXX3DYX708QKVNBWT9KTSKWYKDB7PN2J.${projectuid}`,
                } 
            }
        );

        console.log(result);
        /* if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'project not found' });
        } */
    
        res.status(200).json({ message: 'deployed' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export const getfeaturedproject = async (req: Request, res: Response) => {
    try {
        const projectdata = await mdb.db("crowd").collection('projects').findOne({ featured: true, deployed: true });
        console.log(projectdata);

        // if no featured project, return a random project
        if (!projectdata) {
            const projectdata = await mdb.db("crowd").collection('projects').findOne();
            res.status(200).json({ project: projectdata });
            return;
        }

        res.status(200).json({ project: projectdata });
    } catch (error) {
        res.status(500).json({ error });
    }
}