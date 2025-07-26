import 'express';
import { CustomJwt } from './jwt';

declare global {
  namespace Express {
    export interface Request {
      user: CustomJwt; // 또는 { userId: number, email: string } 같은 직접 정의
    }
    export interface Response {
      success(success: any): this;
      error(error: {
        errorCode?: string;
        reason?: string | null;
        data?: any | null;
      }): this;
    }
  }
}
