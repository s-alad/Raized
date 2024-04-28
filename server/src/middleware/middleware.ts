import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { Request, Response, NextFunction } from 'express';

const message = 'prove you own your wallet';

export const middleware = (req: Request, res: Response, next: NextFunction) => {

    const publickey = Array.isArray(req.headers['publickey']) ? req.headers['publickey'][0] : req.headers['publickey'];
    const signature = Array.isArray(req.headers['signature']) ? req.headers['signature'][0] : req.headers['signature'];
    
    console.log("MIDDLEWARE")
    console.log(publickey, signature);

    if (!publickey || !signature ) {
        console.log("MIDDLEWARE FAILED")
        return res.status(400).json({ message: 'pub, sig, required' });
    }

    const verified = verifyMessageSignatureRsv({publicKey: publickey, message, signature});
    if (!verified) { 
        console.log("MIDDLEWARE FAILED")
        return res.status(400).json({ message: 'signature verification failed' })
    }


    return next();
};
