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
  Query,
  Security
} from 'tsoa';

import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';

import verify from '../middleware/verifyJWT';

import { 
  BodyToAddThread,
  ResponseFromSingleThreadWithLikes,
  ThreadType,
  BodyToLookUpMainThread,
  ResponseFromThreadMainCursor
} from '../middleware/thread.DTO/thread.DTO';

import { UserUnauthorizedError } from '../user/user.Message';

import { ThreadService } from './thread.Service';
import { ThreadInvalidOrderByError, ThreadNoID } from './thread.Message';

@Route('thread')
@Tags('Thread Controller')
export class ThreadController extends Controller {
  ThreadService: ThreadService;
  constructor() {
    super();
    this.ThreadService = new ThreadService();
  }
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
  @Security('jwt_token')
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
      threadSubject: number[];
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    // if (body.userId === undefined || body.userId === null) {
    //   throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    // }

    const userId = req.user.index;
    const newThread: BodyToAddThread = new BodyToAddThread(body, userId);

    const result = await this.ThreadService.addThreadService(newThread);

    console.log('새로운 게시글 ID:', result);

    return new TsoaSuccessResponse<string>(`게시글 업로드 성공: id ${result}`);
  }

  /**
   *
   * 게시글 조회 API
   * @param threadId - 게시글 ID
   * @summary 게시글 조회
   * @returns 게시글의 상세 정보
   */
  @Get('lookUp')
  @SuccessResponse('200', '게시글 조회 성공')
  @Response<ITsoaErrorResponse>('400', '게시글 ID가 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-04',
      reason: '게시글 ID가 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('404', '게시글이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-01',
      reason: '게시글이 없습니다.',
      data: null
    },
    success: null
  })
  public async lookUpThread(
    @Query() threadId: string
  ): Promise<ITsoaSuccessResponse<ResponseFromSingleThreadWithLikes>> {
    if(threadId === undefined || threadId === null) {
      throw new ThreadNoID('게시글 ID가 없습니다.');
    }

    const result = await this.ThreadService.lookUpThreadService(threadId);

    return new TsoaSuccessResponse<ResponseFromSingleThreadWithLikes>(result);
  }

  /**
   * 게시글 메인 조회 API
   * @summary 게시글 페이지 필터링 검색
   * @param body - 게시글 필터링 정보
   * @param body.type - 게시글 타입 (아티클, 팀원모집, 질문)
   * @param body.threadSubject - 게시글 주제 ID 배열
   * @param body.ascend - 정렬 방식 (오름차순 또는 내림차순)
   * @param body.orderBy - 정렬 기준 (createdAt 또는 likeCount)
   * @description 게시글 메인 페이지에서 필터링된 게시글 목록
   * @example
   * {
   *   "type": "아티클",
   *   "threadSubject": [1, 2],
   *   "ascend": true,
   *   "orderBy": "createdAt",
   *   "cursor": 0
   * }
   * @returns 게시글 목록
   */
  @Post('main')
  @SuccessResponse('200', '게시글 메인 조회 성공')
  public async mainThread(
    @Body() body: {
      type: ThreadType;
      threadSubject?: number[];
      orderBy: 'createdAt' | 'likeCount';
      ascend: boolean;
      cursor: number;
    }
  ): Promise<ITsoaSuccessResponse<ResponseFromThreadMainCursor>> {
    if(body.orderBy !== 'createdAt' && body.orderBy !== 'likeCount') {
      throw new ThreadInvalidOrderByError(`정렬 기준은 createdAt 또는 likeCount 중 하나여야 합니다. orderBy: ${body.orderBy}`);
    }

    const result = await this.ThreadService.lookUpThreadMainService(new BodyToLookUpMainThread(body));

    return new TsoaSuccessResponse<ResponseFromThreadMainCursor>(result);
  }
}
