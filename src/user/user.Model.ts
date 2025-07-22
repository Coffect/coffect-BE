import { CustomJwt } from '../../@types/jwt';
import { prisma } from '../config/prisma.config';
import { UserSignUpRequest } from '../middleware/user.DTO/user.DTO';

export class UserModel {
  public async selectUserInfo(userId: string) {
    const q = await prisma.user.findMany({
      where: {
        id: userId
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
    // 생성된 유저의 자동 생성된 id 값을 받아오기 위해 변수에 저장
    const createdUser = await prisma.user.create({
      data: {
        id: info.id,
        password: info.hashed,
        mail: info.email,
        name: info.name,
        salt: info.salt,
        profileImage: info.profile
      }
    });
    const userId = createdUser.userId; // 자동 생성된 id 값
    for (const index of info.interest) {
      await prisma.categoryMatch.create({
        data: { userId: userId, categotyId: index }
      });
    }
  }
}
