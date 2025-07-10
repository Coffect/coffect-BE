import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../config/token';
declare module 'express-serve-static-core' {
  export interface Request {
    decoded: {
      index: number;
      userName: string;
    };
  }
}

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const auth = req.headers.authorization!;
    const decoded = await decodeToken(auth);
    req.decoded = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      // 아직 에러 형식이 정해지지 않아서 구현하지 않음
      return res.status(401).send(err.name);
      // 토큰이 만료된 상황
    } else {
      return res.status(401).send(err.name);
      // 토큰 자체가 잘못되었다.
    }
  }
};
export default verifyToken;
