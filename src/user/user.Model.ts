import { CustomJwt } from '../../@types/jwt';
import { prisma } from '../config/prisma.config';

export class UserModel {
  static async selectUserInfo(userId: string) {
    const q = await prisma.user.findMany({
      where: {
        id: userId
      }
    });
    if (q) {
      return q[0];
    }
    return null;
  }

  static async insertRefreshToken(
    token: CustomJwt,
    rToken: string,
    userAgent: string
  ) {
    const q = await prisma.refeshToken.create({
      data: {
        userId: token.index,
        tokenHashed: rToken,
        createdAt: new Date(token.iat! * 1000),
        expiredAt: new Date(token.exp! * 1000),
        userAgent: userAgent
      }
    });
  }
}
