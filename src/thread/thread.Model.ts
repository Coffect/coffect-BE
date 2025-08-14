import { prisma } from '../config/prisma.config';
import { Prisma } from '@prisma/client';
import { 
  ThreadImageUploadError, 
  ThreadNotFoundError, 
  ThreadTransactionError 
} from './thread.Message';
import { 
  BodyToAddThread,
  BodyToEditThread,
  BodyToLookUpMainThread,
  BodyToPostComment,
  defaultThreadSelect,
  ResponseFromGetComment,
  ResponseFromPostComment,
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

        await Promise.all([
          prisma.subjectMatch.create({ 
            data: {
              threadId: thread.threadId,
              subjectId: Number(newThread.threadSubject)
            }
          }),
          newThread.imageUrls?.length
            ? prisma.threadImage.createMany({ 
              data: newThread.imageUrls.map((imageUrl) => ({
                threadId: thread.threadId,
                imageId: imageUrl
              })) 
            })
            : Promise.resolve()
        ]);

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

  // 게시글 이미지 업로드 모델
  public addThreadImageRepository = async (
    imageUrls: string[],
    threadId: string
  ): Promise<string[]> => {
    if(!imageUrls || imageUrls.length === 0) {
      throw new ThreadImageUploadError('이미지 URL이 없습니다.');
    }

    await prisma.threadImage.createMany({
      data: imageUrls.map((imageUrl) => {
        return {
          threadId: threadId,
          imageId: imageUrl
        };
      })
    })
      .catch((error: any) => {
        throw new ThreadImageUploadError(
          `게시글 이미지 업로드에 실패했습니다. ${error.message}`
        );
      });

    return imageUrls;
  };

  // 게시글 단일 조회 모델
  public lookUpThreadRepository = async (
    threadID: string,
    viewerId: number
  ): Promise<ResponseFromThreadMain | null> => {
    const result = await prisma.thread.findUnique({
      where: { threadId: threadID },
      select: {
        ...defaultThreadSelect,
        // 현재 로그인한 유저가 이 게시글을 좋아하는지 확인
        likes: {
          where: {
            userId: viewerId
          }
        },
        // 현재 로그인한 유저가 이 게시글을 스크랩했는지 확인
        scraps: {
          where: {
            threadScrap: {
              userId: viewerId
            }
          }
        }
      }
    });

    if(result === null) {
      return null;
    }

    console.log(result);

    // 팔로우 유무는 별도로 확인해야 합니다. (게시글 작성자 정보 필요)
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: viewerId, // 팔로우 하는 사람
        followingId: result.userId // 팔로우 당하는 사람 (게시글 작성자)
      }
    });

    // 조회된 정보를 바탕으로 최종 응답 객체 구성
    const finalResult = { ...result, isFollowing: !!isFollowing };

    console.log(finalResult);

    return finalResult;
  };

  // 게시글 메인 페이지 조회 모델 (필터링 포함)
  public lookUpThreadMainRepository = async (
    body: BodyToLookUpMainThread,
    viewerId: number
  ): Promise<ResponseFromThreadMainCursor> => {
    const { type, threadSubject, dateCursor } = body;

    // 페이지네이션 (커서 기반)
    const limit = 10;

    let thread;

    if(threadSubject === undefined) {
      throw new ThreadNotFoundError('게시글 주제가 유효하지 않습니다. type: undefined');
    }

    // console.log(type);
    // console.log(threadSubject);
    // console.log(dateCursor);

    if (dateCursor === undefined) {
      thread = await prisma.thread.findMany({
        take: limit,
        where: {
          AND: [
            {type: type},
            {subjectMatch: {
              some: {
                subjectId: {
                  in: threadSubject
                }
              }
            }}
          ]
        },
        select: {
          ...defaultThreadSelect,
          // 현재 로그인한 유저가 이 게시글을 좋아하는지 확인
          likes: {
            where: {
              userId: viewerId
            }
          },
          // 현재 로그인한 유저가 이 게시글을 스크랩했는지 확인
          scraps: {
            where: {
              threadScrap: {
                userId: viewerId
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }else{
      thread = await prisma.thread.findMany({
        take: limit,
        skip: 1,
        cursor: {
          createdAt: dateCursor
        },
        where: {
          AND: [
            { type: type},
            {subjectMatch: {
              some: {
                subjectId: {
                  in: threadSubject
                }
              }
            }}
          ]
        },
        select: {
          ...defaultThreadSelect,
          // 현재 로그인한 유저가 이 게시글을 좋아하는지 확인
          likes: {
            where: {
              userId: viewerId
            }
          },
          // 현재 로그인한 유저가 이 게시글을 스크랩했는지 확인
          scraps: {
            where: {
              threadScrap: {
                userId: viewerId
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    //console.log(thread);
    // if(thread.length === 0) {
    //   throw new ThreadNotFoundError(`필터링 된 게시글이 없습니다. type: ${type}, subjects: ${threadSubject}`);
    // }

    const threadsWithFollowingStatus = await Promise.all(
      thread.map(async (t) => {
        const isFollowing = await prisma.follow.findFirst({
          where: {
            followerId: viewerId,
            followingId: t.userId
          }
        });
        return { ...t, isFollowing: !!isFollowing };
      })
    );

    const lastThread = threadsWithFollowingStatus[threadsWithFollowingStatus.length - 1];
    let nextCursor: Date | null = lastThread ? lastThread.createdAt : null;

    if(threadsWithFollowingStatus.length < limit) {
      nextCursor = null;
    }

    return {thread: threadsWithFollowingStatus, nextCursor};
  };

  public lookUpLatestThreadMainRepository = async (
    viewerId: number,
    dateCursor?: Date
  ): Promise<ResponseFromThreadMainCursor> => {
    const limit = 10;

    let thread;

    if (dateCursor === undefined) {
      thread = await prisma.thread.findMany({
        take: limit,
        select: {
          ...defaultThreadSelect,
          // 현재 로그인한 유저가 이 게시글을 좋아하는지 확인
          likes: {
            where: {
              userId: viewerId
            }
          },
          // 현재 로그인한 유저가 이 게시글을 스크랩했는지 확인
          scraps: {
            where: {
              threadScrap: {
                userId: viewerId
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      thread = await prisma.thread.findMany({
        take: limit,
        skip: 1,
        cursor: {
          createdAt: dateCursor
        },
        select: {
          ...defaultThreadSelect,
          // 현재 로그인한 유저가 이 게시글을 좋아하는지 확인
          likes: {
            where: {
              userId: viewerId
            }
          },
          // 현재 로그인한 유저가 이 게시글을 스크랩했는지 확인
          scraps: {
            where: {
              threadScrap: {
                userId: viewerId
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    // if(thread.length === 0) {
    //   throw new ThreadNotFoundError('최신 게시글이 없습니다.');
    // }

    const threadsWithFollowingStatus = await Promise.all(
      thread.map(async (t) => {
        const isFollowing = await prisma.follow.findFirst({
          where: {
            followerId: viewerId,
            followingId: t.userId
          }
        });
        return { ...t, isFollowing: !!isFollowing };
      })
    );

    const lastThread = threadsWithFollowingStatus[threadsWithFollowingStatus.length - 1];
    let nextCursor: Date | null = lastThread ? lastThread.createdAt : null;
    if(threadsWithFollowingStatus.length < limit) {
      nextCursor = null;
    }

    return {thread: threadsWithFollowingStatus, nextCursor};
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

  public threadScrapRepository = async (
    threadId: string,
    userId: number
  ): Promise<string | null> => {
    const isExistThread = await prisma.thread.findUnique({
      where: { threadId: threadId }
    });

    if(!isExistThread){
      return null;
    }

    const isExistScrap = await prisma.scrapMatch.findFirst({
      where: {
        threadId: threadId,
        threadScrap: {
          userId: userId
        }
      }
    });

    console.log(isExistScrap);

    if(isExistScrap) {
      // 이미 스크랩한 상태라면, 스크랩을 취소합니다.
      await prisma.$transaction(async (prisma: any) => {
        await prisma.scrapMatch.delete({
          where: {
            threadId_scrapId: {
              threadId: threadId,
              scrapId: isExistScrap.scrapId
            }
          }
        });

        await prisma.threadScrap.delete({
          where: {
            scrapId: isExistScrap.scrapId
          }
        });
      });

      return `스크랩을 취소했습니다. threadId: ${threadId}, userId: ${userId}`;
    }

    const result = await prisma.$transaction(async (prisma: any) => {
      const scrap = await prisma.threadScrap.create({
        data: {
          userId: userId
        }
      });

      const match = await prisma.scrapMatch.create({
        data: {
          scrapId: scrap.scrapId,
          threadId: threadId
        }
      });

      return match;
    })
      .then((match) => {
        return match.threadId;
      })
      .catch(error => {
        throw new ThreadTransactionError(`게시글 스크랩에 실패했습니다. ${error.message}`);
      });

    return result;
  };

  public threadPostCommentRepository = async (
    body: BodyToPostComment,
    userId: number
  ): Promise<ResponseFromPostComment> => {
    const { threadId, commentBody, quote} = body;

    const isExistThread = await prisma.thread.findUnique({
      where: { threadId: threadId }
    });

    if(!isExistThread){
      throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${threadId}`);
    }

    const result = await prisma.comment.create({
      data: {
        threadId: threadId,
        userId: userId,
        commentBody: commentBody,
        quote: quote ? quote : null
      }
    });

    return result;
  };

  public threadGetCommentRepository = async (
    threadId: string
  ): Promise<ResponseFromGetComment[] | null> => {
    const comments = await prisma.comment.findMany({
      where: {threadId: threadId},
      include: {
        user: {
          select: {
            id: true,
            dept: true,
            name: true,
            profileImage: true,
            studentId: true
          }
        }
      }
    });

    if(!comments) {
      return null;
    }

    console.log(comments);

    return comments;
  };

  public threadLikeRepository = async (
    threadId: string,
    userId: number
  ): Promise<string | null> => {
    const isExistLike = await prisma.threadLike.findFirst({
      where: {
        threadId: threadId,
        userId: userId
      }
    });

    if(isExistLike) {
      // 이미 좋아요를 누른 상태라면, 좋아요를 취소합니다.
      await prisma.threadLike.delete({
        where: {
          threadId_userId: {
            threadId: threadId,
            userId: userId
          }
        }
      });
      return null;
    }

    const result = await prisma.threadLike.create({
      data: {
        threadId: threadId,
        userId: userId
      }
    });

    return result.threadId;
  };
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