import { prisma } from '../config/prisma.config';

export class ProfileModel {
  public async selectUserProfile(userId: number) {
    const data = await Promise.all([
      prisma.thread.count({
        where: { userId: userId }
      }),
      prisma.follow.count({
        where: { followingId: userId }
      }),
      prisma.follow.count({
        where: { followerId: userId }
      }),
      prisma.user.findMany({
        where: { userId: userId },
        select: {
          name: true,
          introduce: true,
          profileImage: true,
          dept: true,
          studentId: true,
          UnivList: {
            select: {
              name: true
            }
          }
        }
      })
    ]);
    return data;
  }
}
