import { CustomJwt } from '../../@types/jwt';
import { KSTtime } from '../config/KSTtime';
import { prisma } from '../config/prisma.config';
import { UserSignUpRequest } from '../middleware/user.DTO/user.DTO';

export class UserModel {
  public async selectUserInfo(id: string) {
    const q = await prisma.user.findMany({
      where: {
        id: id
      }
    });
    if (q.length !== 0) {
      return q[0];
    }
    return null;
  }

  public async insertRefreshToken(
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
  public async selectRefreshToken(userIndex: number) {
    const q = await prisma.refeshToken.findMany({
      where: { userId: userIndex }
    });
    if (q[0]) {
      return q[0];
    } else {
      return null;
    }
  }

  public async insertUser(info: UserSignUpRequest) {
    const createdUser = await prisma.user.create({
      data: {
        id: info.id,
        password: info.hashed,
        mail: info.email,
        name: info.name,
        salt: info.salt,
        profileImage: info.profile,
        univId: info.univId,
        dept: info.dept,
        studentId: info.studentId,
        createdAt: KSTtime()
      }
    });
    if (info.interest.length !== 0) {
      const userId = createdUser.userId;
      for (const index of info.interest) {
        await prisma.categoryMatch.create({
          data: { userId: userId, categotyId: index }
        });
      }
    }
    await prisma.specifyInfo.create({
      data: { userId: createdUser.userId, info: [] }
    });
  }
  public async deleteRefreshToken(userId: number) {
    await prisma.refeshToken.delete({
      where: { userId: userId }
    });
  }
}
