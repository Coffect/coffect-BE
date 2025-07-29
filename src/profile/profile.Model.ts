import { prisma } from '../config/prisma.config';
import { ProfileUpdateDTO } from '../middleware/follow.DTO/profile.DTO';

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

  public async updataUserProfile(info: ProfileUpdateDTO) {
    Object.keys(info).forEach(async (key) => {
      const value = info[key as keyof ProfileUpdateDTO];
      if (value) {
        await prisma.user.update({
          where: { userId: info.userId },
          data: {
            [key]: value
          }
        });
      }
    });
  }
  public async selectUserProfileImg(userId: number) {
    const data = await prisma.user.findMany({
      where: { userId: userId },
      select: {
        profileImage: true
      }
    });
    return data[0];
  }
}
