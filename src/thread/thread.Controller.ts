import {
  Controller,
  Post,
  Tags,
  Route,
  SuccessResponse,
  Response,
  Body,
  Middlewares,
  Request,
  Get,
  Query
} from 'tsoa';

import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';

import verify from '../middleware/verifyJWT';

import { BodyToAddThread, ThreadType } from './thread.Model';

import { UserUnauthorizedError } from '../user/user.Message';

import { addThreadService } from './thread.Service';

@Route('thread')
@Tags('Thread Controller')
export class ThreadController extends Controller {
  /**
   *
   * 게시글 업로드 API
   * @param body - 게시글 정보
   * @param body.type - 게시글 타입 (아티클, 팀원모집, 질문)
   * @param body.threadTitle - 게시글 제목
   * @param body.threadBody - 게시글 내용
   * @param body.threadSubject - 게시글 주제 ID
   * @summary 게시글 업로드
   * @returns 업로드된 게시글 UUID
   */
  @Post('add')
  //@Middlewares(verify)
  @SuccessResponse('201', '게시글 업로드 성공')
  @Response<ITsoaErrorResponse>('400', '유저 인증 정보가 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: '유저 인증 정보가 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('500', '게시글 업로드에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-02',
      reason: '게시글 업로드에 실패했습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('500', '게시글 트랜잭션 처리에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-03',
      reason: '게시글 트랜잭션 처리에 실패했습니다.',
      data: null
    },
    success: null
  })
  public async addThread(
    @Request() req: ExpressRequest,
    @Body()
      body: {
      userId?: number;
      type: ThreadType;
      threadTitle: string;
      threadBody: string;
      threadSubject: number;
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    // if(!req.decoded || !req.decoded.index) {
    //   throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    // }

    if (body.userId === undefined || body.userId === null) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    const userId = body.userId;
    const newThread: BodyToAddThread = new BodyToAddThread(body, userId);

    const result = await addThreadService(newThread);

    console.log('새로운 게시글 ID:', result);

    return new TsoaSuccessResponse<string>(`게시글 업로드 성공: id ${result}`);
  }
}
