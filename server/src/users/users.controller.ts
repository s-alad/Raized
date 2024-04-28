import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';

const message = 'prove you own your wallet';

export const getusers = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-users' });
};

export const getuser = async (req: Request, res: Response) => {
    try {
        const { publickey } = req.body;
        if (!publickey) {
            return res.status(400).json({ message: 'authentication failure' });
        }

        const userdata = await mdb.db("crowd").collection('users').findOne({ _id: publickey });
        console.log(userdata);

        res.status(200).json({ user: userdata });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const adduserifnotexists = async (req: Request, res: Response) => {
    try {

        // publickey, signature is required
        const { publickey, stacksaddress } = req.body;
        if (!publickey || !stacksaddress) {
            return res.status(400).json({ message: 'authentication failure' });
        }

        console.log(publickey, stacksaddress);

        // insert into the users collection with the key being the publickey
        const result = await mdb.db("crowd").collection('users').updateOne(
            { _id: publickey,}, 
            { $setOnInsert: 
                {
                    publickey,
                    stacksaddress,
                    onboarded: false,
                }
            }, 
            { upsert: true,}
        );
        console.log(result);

        // get the user data
        const userdata = await mdb.db("crowd").collection('users').findOne({ _id: publickey });
        console.log(userdata);

        res.status(200).json({ user: userdata });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const onboarduser = async (req: Request, res: Response) => {
    try {

        const { publickey, name, email } = req.body;
        if (!publickey) {
            return res.status(400).json({ message: 'authentication failure' });
        }

        const result = await mdb.db("crowd").collection('users').updateOne(
            { _id: publickey,}, 
            { $set: 
                {
                    name,
                    email,
                    onboarded: true,
                }
            }, 
        );
        console.log(result);

        // return the user data
        const userdata = await mdb.db("crowd").collection('users').findOne({ _id: publickey });
        console.log(userdata);

        res.status(200).json({ user: userdata });
    } catch (error) {
        res.status(500).json({ error });
    }
}