import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';

export const getusers = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-users' });
};

export const adduserifnotexists = async (req: Request, res: Response) => {
    try {
        const message = 'prove you own your wallet';

        // publickey, signature is required
        const { publickey, signature, stacksaddress } = req.body;
        if (!publickey || !signature || !stacksaddress) {
            return res.status(400).json({ message: 'authentication failure' });
        }

        // verify the message signature
        const verified = verifyMessageSignatureRsv({ message, publicKey: publickey, signature });
        if (!verified) {
            return res.status(400).json({ message: 'signature is invalid' });
        }
        console.log(verified)

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