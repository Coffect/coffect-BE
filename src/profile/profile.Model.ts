import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.config';
import {
  ProfileUpdateDTO,
  DetailProfileBody
} from '../middleware/detailProfile.DTO/detailProfile.DTO';
import {
  ResponseFromSingleThread,
  ResponseFromThreadMain,
  ResponseFromThreadMainToClient,
  defaultThreadSelect
} from '../middleware/thread.DTO/thread.DTO';
import { SearchUserDTO } from '../middleware/profile.DTO/profile.DTO';

export class ProfileModel {
  public async selectUserProfile(userId: number) {
    try {
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
            userId: true,
            id: true,
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
        }),
        prisma.specifyInfo.findFirst({
          where: { userId: userId },
          select: {
            info: true
          }
        })
      ]);
      return data;
    } catch (error) {
      console.error('Profile select error:', error);
      // 카테고리 조회 실패 시 빈 배열로 대체
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
            id: true,
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
        [], // 카테고리 대신 빈 배열 반환
        [] // 특정 정보 대신 빈 배열 반환
      ]);
      return data;
    }
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
  ): Promise<ResponseFromThreadMainToClient[]> {

    const data: ResponseFromThreadMain[] = await prisma.thread.findMany({
      where: { userId: userId },
      select: defaultThreadSelect
    });
    const result = data.map((item) => new ResponseFromThreadMainToClient(item));
    return result;
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
  public async selectUserId(userId: number) {
    const data = await prisma.user.findFirst({
      where: { userId: userId },
      select: { id: true }
    });
    return data;
  }

  public async postTimeLine(
    userId: number,
    timeLine: string
  ): Promise<string | null> {
    const isExistTimeTable = await prisma.userTimetable.findFirst({
      where: {
        userId: userId
      }
    });

    if (isExistTimeTable) {
      return null;
    }

    const result = await prisma.userTimetable.create({
      data: {
        userId: userId,
        timetable: timeLine
      }
    });

    return result.timetable;
  }

  public async getTimeLine(userId: number): Promise<string | null> {
    const result = await prisma.userTimetable.findFirst({
      where: {
        userId: userId
      }
    });

    if (!result) {
      return null;
    }

    return result.timetable;
  }

  public async fixTimeLine(
    userId: number,
    timeLine: string
  ): Promise<string | null> {
    const result = await prisma.userTimetable.update({
      where: {
        userId: userId
      },
      data: {
        timetable: timeLine
      }
    });

    if (!result) {
      return null;
    }

    return result.timetable;
  }

  public async selectScrap(
    userId: number
  ): Promise<ResponseFromThreadMainToClient[]> {
    const q = `
    select TH.threadId from Thread TH 
    join ScrapMatch SM on TH.threadId = SM.threadId 
    join ThreadScrap TS on SM.scrapId = TS.scrapID
    where TS.userId = ${userId}`;
    const scrap: [{ threadId: string }] = await prisma.$queryRaw(Prisma.raw(q));
    const data: ResponseFromThreadMain[] = await prisma.thread.findMany({
      where: { threadId: { in: scrap.map((item) => item.threadId) } },
      select: defaultThreadSelect
    });
    const result = data.map((item) => new ResponseFromThreadMainToClient(item));
    return result;
  }

  public async searchUser(id: string): Promise<SearchUserDTO[]> {
    const data = await prisma.user.findMany({
      where: { id: { startsWith: id } },
      select: { id: true, name: true, userId: true, profileImage: true }
    });
    return data;
  }

  public async isCoffeeChat(userId: number, otherUserId: number) {
    const data = await prisma.coffeeChat.findFirst({
      where: {
        OR: [
          { firstUserId: userId, secondUserId: otherUserId },
          { firstUserId: otherUserId, secondUserId: userId }
        ]
      },
      select: { firstUserId: true, secondUserId: true, valid: true }
    });
    return data;
  }
}
