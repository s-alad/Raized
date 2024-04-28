import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';

const message = 'prove you own your wallet';

export const getprojects = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-projects' });
};

export const startproject = async (req: Request, res: Response) => {
    const { publickey, signature, projectname } = req.body;

    const verified = verifyMessageSignatureRsv({publicKey: publickey, message, signature});
    if (!verified) { return res.status(400).json({ message: 'signature verification failed' }) }

    const startedproject = {
        creator: publickey,
        projectname,
    }
    const projectresult = await mdb.db('crowd').collection('projects').insertOne(startedproject);
    const updateuser = await mdb.db('crowd').collection('users').updateOne(
        {publickey}, {$set: {project: projectresult.insertedId}}
    );

    // update the users project array 
    

}