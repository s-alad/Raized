import { Request, Response } from 'express';
import { mdb } from '..';

export const main = async (_: Request, res: Response) => {
  res.status(200).json({ message: 'main' });
};

export const check = async (_: Request, res: Response) => {
  try {
    const dbs = await mdb.db().admin().listDatabases();
    res.status(200).json({ dbs });
  } catch (error) {
    res.status(500).json({ error });
  }
}
