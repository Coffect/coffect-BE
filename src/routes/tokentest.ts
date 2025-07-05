import express, { Request, Response } from 'express';
import { accessToken, refreshToken } from '../config/token';
import verifyToken from '../middleware/verify';

const test = express.Router();

test.post('/login', (req: Request, res: Response) => {
  const data = req.body;
  const atoken = accessToken(data.userName, data.userId);
  const rToken = refreshToken(data.userName, data.userId);
  res.json({ atoken, rToken });
});

test.get('/verify', verifyToken, async (req: Request, res: Response) => {
  if (req.decoded) {
    res.json(req.decoded);
  } else {
    res.send('no data');
  }
});

export default test;
