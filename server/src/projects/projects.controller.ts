import { Request, Response } from 'express';
import { mdb } from '..';

import { verifyMessageSignatureRsv } from '@stacks/encryption';

const message = 'prove you own your wallet';

export const getprojects = async (_: Request, res: Response) => {
    res.status(200).json({ message: 'get-projects' });
};