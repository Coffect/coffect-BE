import { JwtExpiredError, JwtTokenInvaild } from './error';
import { verifyToken } from '../config/token';
import { Request } from 'express';

export async function expressAuthentication(
  req: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'jwt_token') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new JwtTokenInvaild('Authorization header is missing');
    }
    try {
      const decoded = await verifyToken(authHeader);
      return decoded;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new JwtExpiredError(err.name);
      } else {
        throw new JwtTokenInvaild(err.name);
      }
    }
  }
  throw new Error('Unknown security scheme');
}
