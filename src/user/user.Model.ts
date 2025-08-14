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

    await prisma.userTimetable.create({
      data: {
        userId: createdUser.userId,
        timetable: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
      }
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
      await tx.threadScrap.deleteMany({
        where: { userId: userId }
      });

      // 19. 마지막으로 User 삭제
      await tx.user.delete({
        where: { userId: userId }
      });
    });
  }
}
