import { prisma } from '../config/prisma.config';
import {
  ProfileUpdateDTO,
  DetailProfileBody
} from '../middleware/detailProfile.DTO/detailProfile.DTO';
import { ResponseFromSingleThread } from '../middleware/thread.DTO/thread.DTO';

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
      }),
      prisma.categoryMatch.findMany({
        where: { userId: userId },
        select: {
          category: {
            select: {
              categoryId: true,
              categoryName: true,
              categoryColor: true
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

  public async deleteInterest(userId: number) {
    await prisma.categoryMatch.deleteMany({
      where: { userId: userId }
    });
  }

  public async insertInterest(userId: number, interest: number[]) {
    for (const index of interest) {
      await prisma.categoryMatch.create({
        data: {
          userId: userId,
          categotyId: index
        }
      });
    }
  }
  public async selectUserThread(
    userId: number
  ): Promise<{ data: ResponseFromSingleThread[]; likes: number[] }> {
    const data = await prisma.thread.findMany({
      where: { userId: userId },
      select: {
        threadId: true,
        thradBody: true,
        threadTitle: true,
        threadShare: true,
        createdAt: true,
        type: true,
        subjectMatch: {
          select: {
            threadSubject: {
              select: {
                subjectId: true,
                subjectName: true
              }
            }
          }
        },
        user: {
          select: {
            userId: true,
            name: true,
            profileImage: true
          }
        }
      }
    });

    const likes: number[] = [];
    for (const thread of data) {
      const like = await prisma.threadLike.count({
        where: { threadId: thread.threadId }
      });
      likes.push(like);
    }
    return { data, likes };
  }

  public async selectSpecificInfo(userId: number) {
    try {
      const data = await prisma.specifyInfo.findMany({
        where: { userId: userId },
        select: {
          info: true
        }
      });

      // 해당 유저의 정보가 없으면 기본 정보를 생성
      if (data.length === 0) {
        await prisma.specifyInfo.create({
          data: {
            userId: userId
          }
        });
      }
      return data[0].info;
    } catch (error) {
      console.error('Error in selectSpecificInfo:', error);
      throw new Error('유저 정보 조회 중 오류가 발생했습니다.');
    }
  }

  public async updateSpecificInfo(userId: number, body: DetailProfileBody[]) {
    await prisma.specifyInfo.upsert({
      where: { userId: userId },
      update: { info: body as any },
      create: { userId: userId, info: body as any }
    });
  }
}
