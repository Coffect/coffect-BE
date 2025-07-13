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
    await prisma.refeshToken.upsert({
      where: { userId: token.index },
      update: {
        tokenHashed: rToken,
        createdAt: new Date(token.iat! * 1000),
        expiredAt: new Date(token.exp! * 1000),
        userAgent: userAgent
      },
      create: {
        userId: token.index,
        userName: token.userName,
        tokenHashed: rToken,
        createdAt: new Date(token.iat! * 1000),
        expiredAt: new Date(token.exp! * 1000),
        userAgent: userAgent
      }
    });
  }
}
