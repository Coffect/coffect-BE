import { Prisma } from '@prisma/client';
import { CustomJwt } from '../../@types/jwt';
import { KSTtime } from '../config/KSTtime';
import { prisma } from '../config/prisma.config';
import { DetailProfileBody } from '../middleware/detailProfile.DTO/detailProfile.DTO';
import { UserSignUpRequest } from '../middleware/user.DTO/user.DTO';
import { UserServerError } from './user.Message';

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
    const defaultInfo: DetailProfileBody[] = [
      {
        answer: '',
        isMain: false,
        question: 'Q. 어떤 분야에서 성장하고 싶나요?'
      },
      {
        answer: '',
        isMain: false,
        question: 'Q. 커피챗에서 나누고 싶은 이야기는?'
      },
      {
        answer: '',
        isMain: false,
        question: 'Q. 새롭게 배워보고 싶은 분야는?'
      },
      {
        answer: '',
        isMain: false,
        question: 'Q. 요즘 내가 가장 열중하고 있는 것은?'
      }
    ];

    await prisma
      .$transaction(async (tx) => {
        // 1. User 생성
        const createdUser = await tx.user.create({
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

        // 2. 관심사 카테고리 매칭 생성
        if (info.interest.length !== 0) {
          const userId = createdUser.userId;
          for (const index of info.interest) {
            await tx.categoryMatch.create({
              data: { userId: userId, categotyId: index }
            });
          }
        }

        // 3. 상세 정보 생성
        await tx.specifyInfo.create({
          data: {
            userId: createdUser.userId,
            info: defaultInfo as unknown as Prisma.JsonArray
          }
        });

        // 4. 시간표 생성
        await tx.userTimetable.create({
          data: {
            userId: createdUser.userId,
            timetable:
              '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          }
        });
      })
      .catch((error) => {
        console.log(error);
        throw new UserServerError('데이터베이스 삽입에 실패했습니다.');
      });
  }
  public async deleteRefreshToken(userId: number) {
    await prisma.refeshToken.delete({
      where: { userId: userId }
    });
  }

  public async selectUserFCMToken(userId: number) {
    const q = await prisma.userFCMToken.findMany({
      where: { userId: userId }
    });
    if (q[0]) {
      return q[0];
    } else {
      return null;
    }
  }

  public async deleteUserFCMToken(userId: number) {
    await prisma.userFCMToken.delete({
      where: { userId: userId }
    });
  }

  public async deleteUser(userId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. RefreshToken 삭제
      await tx.refeshToken.deleteMany({
        where: { userId: userId }
      });

      // 2. UserFCMToken 삭제
      await tx.userFCMToken.deleteMany({
        where: { userId: userId }
      });

      // 3. SpecifyInfo 삭제
      await tx.specifyInfo.deleteMany({
        where: { userId: userId }
      });

      // 4. CategoryMatch 삭제
      await tx.categoryMatch.deleteMany({
        where: { userId: userId }
      });

      // 5. Notification 삭제
      await tx.notification.deleteMany({
        where: { userId: userId }
      });

      // 6. Follow 관계 삭제 (팔로워/팔로잉)
      await tx.follow.deleteMany({
        where: {
          OR: [{ followerId: userId }, { followingId: userId }]
        }
      });

      // 7. CoffeeChat 삭제
      await tx.coffeeChat.deleteMany({
        where: {
          OR: [{ firstUserId: userId }, { secondUserId: userId }]
        }
      });

      // 8. Message 삭제
      await tx.message.deleteMany({
        where: { userId: userId }
      });

      // 8-1. 사용자가 다른 글에 남긴 Comment 삭제
      await tx.comment.deleteMany({
        where: { userId: userId }
      });

      // 9. ChatRoomUser 삭제
      await tx.chatRoomUser.deleteMany({
        where: { userId: userId }
      });

      // 10. 사용자가 작성한 Thread의 ID들을 먼저 가져오기
      const userThreads = await tx.thread.findMany({
        where: { userId: userId },
        select: { threadId: true }
      });

      const threadIds = userThreads.map((thread) => thread.threadId);

      if (threadIds.length > 0) {
        // 11. ThreadImage 삭제 (Thread의 하위 테이블)
        await tx.threadImage.deleteMany({
          where: { threadId: { in: threadIds } }
        });

        // 12. SubjectMatch 삭제 (Thread의 하위 테이블)
        await tx.subjectMatch.deleteMany({
          where: { threadId: { in: threadIds } }
        });

        // 13. ScrapMatch 삭제 (Thread의 하위 테이블)
        await tx.scrapMatch.deleteMany({
          where: { threadId: { in: threadIds } }
        });

        // 14. Comment 삭제 (Thread의 하위 테이블)
        await tx.comment.deleteMany({
          where: { threadId: { in: threadIds } }
        });

        // 15. ThreadLike 삭제 (Thread의 하위 테이블)
        await tx.threadLike.deleteMany({
          where: { threadId: { in: threadIds } }
        });

        // 16. 이제 Thread 삭제
        await tx.thread.deleteMany({
          where: { userId: userId }
        });
      }

      // 17. ThreadLike 삭제 (사용자가 좋아요한 것들)
      await tx.threadLike.deleteMany({
        where: { userId: userId }
      });

      // 18. ThreadScrap 삭제
      // 18-1. 사용자의 ThreadScrap 목록 조회 후 ScrapMatch 먼저 정리
      const userScraps = await tx.threadScrap.findMany({
        where: { userId: userId },
        select: { scrapId: true }
      });

      const scrapIds = userScraps.map((scrap) => scrap.scrapId);
      if (scrapIds.length > 0) {
        await tx.scrapMatch.deleteMany({
          where: { scrapId: { in: scrapIds } }
        });
      }

      // 18-2. ThreadScrap 삭제
      await tx.threadScrap.deleteMany({
        where: { userId: userId }
      });

      // 19. UserTimetable 삭제
      await tx.userTimetable.deleteMany({
        where: { userId: userId }
      });

      // 20. 마지막으로 User 삭제
      await tx.user.delete({
        where: { userId: userId }
      });
    });
  }
}
