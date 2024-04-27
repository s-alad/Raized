import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';

export const getusers = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-users' });
};

export const adduser = async (req: Request, res: Response) => {
    try {
        // publickey, signature, message is required
        // name, email are optional

        const { publickey, signature, message, name, email } = req.body;
        if (!publickey || !signature || !message) {
            return res.status(400).json({ message: 'authentication' });
        }

        // verify the message signature
        console.log("verifying")
        const verified = verifyMessageSignatureRsv({ message, publicKey: publickey, signature });
        if (!verified) {
            return res.status(400).json({ message: 'signature is invalid' });
        }

        console.log(verified)

        // insert into the users collection with the key being the publickey
        const result = await mdb.db("crowd").collection('users').insertOne({
            _id: publickey,
            publickey,
            name,
            email,
        });


        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}