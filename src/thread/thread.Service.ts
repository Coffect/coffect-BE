import { 
  ThreadCreateError, 
  ThreadNotFoundError, 
  ThreadPostCommentError, 
  ThreadScrapError 
} from './thread.Message';
import { 
  BodyToAddThread, 
  BodyToEditThread, 
  BodyToLookUpMainThread, 
  BodyToPostComment, 
  ResponseFromGetComment, 
  ResponseFromPostComment, 
  ResponseFromSingleThreadWithLikes, 
  ResponseFromThreadMainCursor, 
  ResponseFromThreadMainCursorToClient, 
  ResponseFromThreadMainToClient
} from '../middleware/thread.DTO/thread.DTO';

import { ThreadModel } from './thread.Model';
import { uploadToS3 } from '../config/s3';

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

  public addThreadImageService = async (
    image: Express.Multer.File[],
    threadId: string
  ): Promise<string[]> => {
    const imageUrls: string[] = [];
    while (image.length > 0) {
      const file = image.shift();
      if (!file) continue;

      const imageUrl = await uploadToS3(file);
      
      imageUrls.push(imageUrl);
    }

    const result = await this.ThreadModel.addThreadImageRepository(imageUrls, threadId);

    return result;
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
  ): Promise<ResponseFromThreadMainCursorToClient> => {
    let results: ResponseFromThreadMainCursor;

    results = await this.ThreadModel.lookUpThreadMainRepository(body);

    const thread: ResponseFromThreadMainToClient[] = results.thread.map((thread: any) => {
      return new ResponseFromThreadMainToClient(thread);
    });

    console.log(thread);

    if (!results || results.thread.length === 0) {
      throw new ThreadNotFoundError(`필터링 된 게시글이 없습니다. type: ${body.type}, subjects: ${body.threadSubject}`);
    }

    return {thread, nextCursor: results.nextCursor};
  };

  public threadEditService = async (
    body: BodyToEditThread
  ): Promise<string> => {
    const result = await this.ThreadModel.threadEditRepository(body);

    if(result === null){
      throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${body.threadId}`);
    }

    return result;
  };

  public threadDeleteService = async (
    threadId: string
  ): Promise<string> => {
    const result = await this.ThreadModel.threadDeleteRepository(threadId);

    if(result === null) {
      throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${threadId}`);
    }

    return result;
  };

  public threadScrapService = async (
    threadId: string,
    userId: number
  ): Promise<string> => {
    const result = await this.ThreadModel.threadScrapRepository(threadId, userId);

    if(result === null || !result){
      throw new ThreadScrapError(`게시물 스크랩에 실패했습니다. threadId: ${threadId}, userId: ${userId}`);
    }

    return result;
  };

  public threadPostCommentService = async (
    body: BodyToPostComment,
    userId: number
  ): Promise<ResponseFromPostComment> => {
    const result = await this.ThreadModel.threadPostCommentRepository(body, userId);

    if(!result) {
      throw new ThreadPostCommentError(`댓글 작성에 실패했습니다. threadId: ${body.threadId}, userId: ${userId}`);
    }

    return result;
  };

  public threadGetCommentService = async (
    threadId: string
  ): Promise<ResponseFromGetComment[]> => {
    const result = await this.ThreadModel.threadGetCommentRepository(threadId);

    if(result === null || result.length === 0) {
      throw new ThreadNotFoundError(`댓글이 없습니다. threadId: ${threadId}`);
    }

    return result;
  };

  public threadLikeService = async (
    threadId: string,
    userId: number
  ): Promise<string> => {
    const result = await this.ThreadModel.threadLikeRepository(threadId, userId);

    if(result === null) {
      throw new ThreadNotFoundError(`게시글이 없습니다. ID: ${threadId}`);
    }

    return result;
  };
}