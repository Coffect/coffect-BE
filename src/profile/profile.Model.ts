import { prisma } from '../config/prisma.config';

export class ProfileModel {
  public async selectUserProfile(userId: number) {
    const [threadCount, following, follower, userInfo] = await Promise.all([
      prisma.thread.count({
        where: { userId: userId }
      }),
      prisma.follow.count({
        where: { followingId: userId }
      }),
      prisma.follow.count({
        where: { followerId: userId }
      }),
      prisma.user.findFirst({
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
    console.log(threadCount, following, follower, userInfo);
  }
}
