import { ThreadCreateError } from './thread.Message';
import { BodyToAddThread } from './thread.Model';

import { addThreadRepository } from './thread.Repository';

export class ThreadService {
  constructor() {}
}
export const addThreadService = async (
  newThread: BodyToAddThread
): Promise<string> => {
  const newThreadId: string = await addThreadRepository(newThread);

  if (!newThreadId) {
    throw new ThreadCreateError(
      `게시글 업로드에 실패했습니다. type: ${newThread.type}, title: ${newThread.threadTitle}`
    );
  }

  return newThreadId;
};
