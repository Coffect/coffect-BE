import { prisma } from '../config/prisma.config';
import { Prisma } from '@prisma/client';
import { ThreadNotFoundError, ThreadTransactionError } from './thread.Message';
import { 
  BodyToAddThread,
  BodyToEditThread,
  BodyToLookUpMainThread,
  ResponseFromSingleThreadWithLikes,
  ResponseFromThread,
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
          data: newThread.threadSubject.map((subjectId) => ({
            threadId: thread.threadId,
            subjectId: subjectId
          }))
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

  // 게시글 메인 페이지 조회 모델 (필터링 포함)
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

    let nextCursor = cursor + thread.length;
    if(thread.length < limit) { // 마지막 게시글
      nextCursor = -1;
    }

    return {thread, nextCursor};
  };

  public threadEditRepository = async (
    body: BodyToEditThread
  ): Promise<string | null> => {
    const isExistThread = await prisma.thread.findUnique({
      where: { threadId: body.threadId }
    });

    if(!isExistThread){
      return null;
    }

    const transaction = await prisma.$transaction(async (prisma: any) => {
      const result = await prisma.thread.update({
        where: { threadId: body.threadId },
        data: {
          threadTitle: body.threadTitle,
          thradBody: body.threadBody,
          type: body.type
        }
      });

      await prisma.subjectMatch.deleteMany({
        where: { threadId: body.threadId }
      });

      await prisma.subjectMatch.createMany({
        data: body.threadSubject.map((subjectId) => ({
          threadId: result.threadId,
          subjectId: subjectId
        }))
      });

      return result;
    })
      .catch(error => {
        throw new ThreadTransactionError(`게시글 수정에 실패했습니다. ${error.message}`);
      });

    return transaction.threadId;
  };

  public threadDeleteRepository = async (
    threadId: string
  ): Promise<string | null> => {
    const isExistThread = await prisma.thread.findUnique({
      where: { threadId: threadId }
    });

    if(!isExistThread){
      return null;
    }

    const result = await prisma.$transaction(async (prisma: any) => {
      await prisma.subjectMatch.deleteMany({
        where: { threadId: threadId }
      });
      
      const thread = await prisma.thread.delete({
        where: { threadId: threadId }
      });
      
      return thread;
    })
      .then((thread) => {
        return thread.threadId;
      })
      .catch(error => {
        throw new ThreadTransactionError(`게시글 삭제에 실패했습니다. ${error.message}`);
      });

    return result.threadId;
  };

  // public threadScrapRepository = async (
  //   threadId: string,
  //   userId: number
  // ): Promise<string | null> => {
  //   const isExistThread = await prisma.thread.findUnique({
  //     where: { threadId: threadId }
  //   });

  //   if(!isExistThread){
  //     return null;
  //   }

  //   const isExistScrap = await prisma.scrapMatch.findUnique({
  //     where: {
  //       threadId: threadId,
  //     }
  //   })
  // }
}

export const checkThreadOwner = async (
  threadId: string,
  userId: number
): Promise<boolean> => {
  const thread = await prisma.thread.findUnique({
    where: {threadId: threadId},
    select: {userId: true}
  });

  if(thread === null) {
    throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${threadId}`);
  }

  return thread.userId === userId;
};