import { prisma } from '../config/prisma.config';
import { ThreadTransactionError } from './thread.Message';
import {
  BodyToAddThread
} from './thread.Model';

export const addThreadRepository = async (newThread: BodyToAddThread): Promise<string> => {
  const result = await prisma.$transaction(async (prisma) => {
    const thread = await prisma.thread.create({
      data: {
        type: newThread.type,
        threadTitle: newThread.threadTitle,
        thradBody: newThread.threadBody,
        userId: newThread.userId,
        threadShare: 0
      }
    });
  
    await prisma.subjectMatch.create({
      data: {
        threadId: thread.threadId,
        subjectId: newThread.threadSubject
      }
    });
    return thread;
  })
    .catch((error) => {
      throw new ThreadTransactionError(error.message + `type: ${newThread.type}, title: ${newThread.threadTitle}`);
    });

  return result.threadId;
};