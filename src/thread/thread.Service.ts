import { ThreadCreateError, ThreadNotFoundError } from './thread.Message';
import { BodyToAddThread, BodyToLookUpMainThread, ResponseFromSingleThreadWithLikes } from '../middleware/thread.DTO/thread.DTO';

import { ThreadModel } from './thread.Model';

export class ThreadService {
  ThreadModel: ThreadModel;
  constructor() {
    this.ThreadModel = new ThreadModel();
  }

  // 게시글 업로드 서비스
  public addThreadService = async (
    newThread: BodyToAddThread
  ): Promise<string> => {
    const newThreadId: string = await this.ThreadModel.addThreadRepository(newThread);

    if (!newThreadId) {
      throw new ThreadCreateError(
        `게시글 업로드에 실패했습니다. type: ${newThread.type}, title: ${newThread.threadTitle}`
      );
    }

    return newThreadId;
  };

  // 게시글 단일 조회 서비스
  public lookUpThreadService = async (
    threadId: string
  ): Promise<ResponseFromSingleThreadWithLikes> => {
    const result = await this.ThreadModel.lookUpThreadRepository(threadId);

    if (!result.result) {
      throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${threadId}`);
    }

    return result;
  };

  public lookUpThreadMainService = async (
    body: BodyToLookUpMainThread
  ): Promise<any> => {
    const results: any[] = await this.ThreadModel.lookUpThreadMainRepository(body);

    if (!results || results.length === 0) {
      throw new ThreadNotFoundError(`필터링 된 게시글이 없습니다. type: ${body.type}, subjects: ${body.threadSubject}`);
    }

    // bigint 변환
    const serializedResults = results.map((thread) => ({
      ...thread,
      likeCount: Number(thread.likeCount) // BigInt를 Number로 변환
    }));

    return serializedResults;
  };
}