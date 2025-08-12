import { verifyToken } from '../config/token';
import { SocketConnectionError } from '../socket/socket.message';
import { JwtExpiredError, JwtTokenInvaild } from './error';
import { Socket } from 'socket.io';
declare module 'express-serve-static-core' {
  export interface Request {
    decoded: {
      index: number;
      userName: string;
    };
  }
}

const verifySocket = async (
  socket: Socket,
  next: (err?: any) => void
): Promise<void> => {
  try {
    const auth =
      socket.handshake.auth.token || socket.handshake.headers.authorization;
    if (!auth) {
      return next(new JwtTokenInvaild('Token is required'));
    }
    const decoded = await verifyToken(auth);
    socket.data.decoded = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new JwtExpiredError(err.name));
    } else {
      return next(new JwtTokenInvaild(err.name));
    }
  }
};
export default verifySocket;
