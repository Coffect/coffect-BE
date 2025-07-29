import { prisma } from '../config/prisma.config';
import { Prisma } from '@prisma/client';
import { ThreadTransactionError } from './thread.Message';
import { 
  BodyToAddThread,
  BodyToLookUpMainThread,
  ResponseFromSingleThreadWithLikes,
  ResponseFromThreadMain,
  ResponseFromThreadMainCursor
} from '../middleware/thread.DTO/thread.DTO';

export class ThreadModel {
  // 게시글 업로드 모델
  public addThreadRepository = async (
    newThread: BodyToAddThread
  ): Promise<string> => {
    const result = await prisma
      .$transaction(async (prisma: any) => {
        const thread = await prisma.thread.create({
          data: {
            type: newThread.type,
            threadTitle: newThread.threadTitle,
            thradBody: newThread.threadBody,
            userId: newThread.userId,
            threadShare: 0
          }
        });

        await prisma.subjectMatch.createMany({
          data: {
            threadId: thread.threadId,
            subjectId: newThread.threadSubject
          }
        });
        return thread;
      })
      .catch((error: any) => {
        throw new ThreadTransactionError(
          error.message +
  `type: ${newThread.type}, title: ${newThread.threadTitle}`
        );
      });

    return result.threadId;
  };

  // 게시글 단일 조회 모델
  public lookUpThreadRepository = async (
    threadID: string
  ): Promise<ResponseFromSingleThreadWithLikes> => {
    const result = await prisma.thread.findUnique({
      where: { threadId: threadID },
      include: {
        user: {
          select: {
            userId: true,
            name: true,
            profileImage: true
          }
        },
        subjectMatch: {
          select: {
            threadSubject: {
              select: {
                subjectId: true,
                subjectName: true
              }
            }
          }
        }
      }
    });

    const likes: number = await prisma.threadLike.count({
      where: { threadId: threadID }
    });

    return {result, likes};
  };

  public lookUpThreadMainRepository = async (
    body: BodyToLookUpMainThread
  ): Promise<ResponseFromThreadMainCursor> => {
    const { type, threadSubject, ascend, cursor } = body;

    // 정렬 순서
    const orderClause = ascend ? Prisma.sql`ORDER BY ${body.orderBy} ASC` : Prisma.sql`ORDER BY ${body.orderBy} DESC`;

    // 페이지네이션 (커서 기반)
    const limit = 10;
    const offset = cursor > 0 ? (cursor - 1) * limit : 0;
    const paginationClause = Prisma.sql`LIMIT ${limit} OFFSET ${offset}`;
    let thread: ResponseFromThreadMain[];

    // 주제 필터링이 없는 경우
    if (!threadSubject || threadSubject.length === 0) {
      thread = await prisma.$queryRaw`
        SELECT
          T.threadId, T.userId, T.threadTitle, T.thradBody, T.createdAt, T.threadShare,
          U.name, U.profileImage,
          (SELECT COUNT(*) FROM ThreadLike WHERE threadId = T.threadId) AS likeCount
        FROM Thread AS T
        JOIN User AS U ON T.userId = U.userId
        ${orderClause}
        ${paginationClause}
      `;
    }else{
      thread = await prisma.$queryRaw`
      SELECT
        T.threadId, T.userId, T.threadTitle, T.thradBody, T.createdAt, T.threadShare,
        U.name, U.profileImage,
        (SELECT COUNT(*) FROM ThreadLike WHERE threadId = T.threadId) AS likeCount
      FROM Thread AS T
      JOIN User AS U ON T.userId = U.userId
      JOIN SubjectMatch AS SM ON T.threadId = SM.threadId
      WHERE T.type = ${type} AND SM.subjectId IN (${Prisma.join(threadSubject)})
      GROUP BY T.threadId, T.userId, T.threadTitle, T.thradBody, T.createdAt, T.threadShare, U.name, U.profileImage
      HAVING COUNT(DISTINCT SM.subjectId) = ${threadSubject.length}
      ${orderClause}
      ${paginationClause}
    `;
    }

    var nextCursor = cursor + thread.length;
    if(thread.length < limit) { // 마지막 게시글
      nextCursor = -1;
    }

    return {thread, nextCursor};
  };
}