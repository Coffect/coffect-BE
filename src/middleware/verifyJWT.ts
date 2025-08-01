import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/token';
import { JwtExpiredError, JwtTokenInvaild } from './error';
declare module 'express-serve-static-core' {
  export interface Request {
    decoded: {
      index: number;
      userName: string;
    };
  }
}

const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const auth = req.headers.authorization || '';
    const decoded = await verifyToken(auth);
    req.decoded = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new JwtExpiredError(err.name);
    } else {
      throw new JwtTokenInvaild(err.name);
    }
  }
};
export default verify;
