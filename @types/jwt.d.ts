import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwt extends JwtPayload {
  index: number;
  userName: string;
}
