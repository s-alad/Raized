import { Request, Response } from 'express';
import { mdb } from '..';

export const getusers = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-users' });
};

export const adduser = async (req: Request, res: Response) => {
    try {
        // publickey is required
        // name, email are optional

        const { publickey, name, email } = req.body;
        if (!publickey) {
            return res.status(400).json({ message: 'publickey is required' });
        }

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