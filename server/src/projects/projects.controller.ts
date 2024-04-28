import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { PushOperator } from 'mongodb';

import { v4 as uuidv4 } from 'uuid';

const message = 'prove you own your wallet';

export const getprojects = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-projects' });
};

export const getproject = async (req: Request, res: Response) => {
    const { projectuid } = req.body;
    if (!projectuid) {
        return res.status(400).json({ message: 'project not found' });
    }

    const projectdata = await mdb.db("crowd").collection('projects').findOne({ _id: projectuid });
    console.log(projectdata);

    res.status(200).json({ project: projectdata });
}

export const startproject = async (req: Request, res: Response) => {
    console.log("!---------------------")
    const { projectname } = req.body;
    const publickey = req.headers['publickey'] as string as any;
    console.log(projectname, publickey);

    const projectuid = uuidv4().replace(/-/g, '');


    const result = await mdb.db("crowd").collection('projects').updateOne(
        { _id: projectuid as any,}, 
        { $setOnInsert: {
                creator: publickey,
                projectname,
                projectuid,
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