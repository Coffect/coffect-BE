import {
  Controller,
  Post,
  Tags,
  Route,
  SuccessResponse,
  Response,
  Body,
  Request,
  Get,
  Query,
  Security,
  Patch,
  Delete,
  FormField,
  UploadedFiles
} from 'tsoa';

import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';

import { 
  BodyToAddThread,
  ResponseFromSingleThreadWithLikes,
  ThreadType,
  BodyToLookUpMainThread,
  ResponseFromThreadMainCursorToClient,
  ResponseFromPostComment,
  ResponseFromGetComment,
  ResponseFromThreadMainCursor
} from '../middleware/thread.DTO/thread.DTO';

import { UserUnauthorizedError } from '../user/user.Message';

import { ThreadService } from './thread.Service';
import { ThreadInvalidOrderByError, ThreadNoID, ThreadUnauthorizedError } from './thread.Message';
import { checkThreadOwner } from './thread.Model';
import { Thread_type } from '@prisma/client';

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
      type: ThreadType;
      threadTitle: string;
      threadBody: string;
      threadSubject: number[];
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    const userId = req.user.index;
    const newThread: BodyToAddThread = new BodyToAddThread(body, userId);

    const result = await this.ThreadService.addThreadService(newThread);

    console.log('새로운 게시글 ID:', result);

    return new TsoaSuccessResponse<string>(result);
  }

  // 나중에 리팩토링 필요 - 게시글 이미지 업로드와 게시글 업로드 통합 가능
  // 또는 수정할 때 재사용할 수 있는 API로 냅둬도 될 듯?
  /**
   * 게시글 이미지 업로드 API
   * @summary 게시글 이미지 업로드
   */
  @Post('addImage')
  @Security('jwt_token')
  @SuccessResponse('201', '게시글 이미지 업로드 성공')
  public async addThreadImage(
    @Request() req: ExpressRequest,
    @FormField() threadId: string,
    @UploadedFiles('image') image: Express.Multer.File[]
  ): Promise<ITsoaSuccessResponse<string[]>> {
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    const verifyRequest: boolean = await checkThreadOwner(threadId, req.user.index);
    
    if(!verifyRequest) {
      throw new ThreadUnauthorizedError(`게시글 이미지 업로드 권한이 없습니다. ID: ${threadId}`);
    }

    const result = await this.ThreadService.addThreadImageService(image, threadId);

    return new TsoaSuccessResponse<string[]>(result);
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
  @Response<ITsoaErrorResponse>('400', '유효하지 않은 정렬 기준입니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-05',
      reason: '유효하지 않은 정렬 기준입니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('404', '필터링 된 게시글이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-01',
      reason: '필터링 된 게시글이 없습니다.',
      data: null
    },
    success: null
  })
  public async mainThread(
    @Body() body: {
      type?: Thread_type;
      threadSubject?: number[];
      orderBy: 'createdAt' | 'likeCount';
      ascend: boolean;
      likeCursor?: number;
      dateCursor?: Date;
    }
  ): Promise<ITsoaSuccessResponse<ResponseFromThreadMainCursor>> {
    if(body.orderBy !== 'createdAt' && body.orderBy !== 'likeCount') {
      throw new ThreadInvalidOrderByError(`정렬 기준은 createdAt 또는 likeCount 중 하나여야 합니다. orderBy: ${body.orderBy}`);
    }

    const result = await this.ThreadService.lookUpThreadMainService(new BodyToLookUpMainThread(body));

    return new TsoaSuccessResponse<ResponseFromThreadMainCursor>(result);
  }

  /**
   * 게시글 수정 API
   * @param body 수정 게시물에 대한 정보와 수정 사항들
   * @param body.threadId 스레드 ID
   * @param body.threadTitle 스레드 제목
   * @param body.threadBody 스레드 본문
   * @param body.type 스레드 타입
   * @param body.threadSubject 스레드 주제
   * @example {
   *  "threadId": "312be12e-df91-4213-9801-4a8aaa9139c6",
   *  "threadTitle": "수정된 제목",
   *  "threadBody": "수정된 본문 내용",
   *  "type": "아티클",
   *  "threadSubject": [1, 2]
   * }
   * @summary 게시물 수정
   * @returns 수정 성공한 게시물의 ID
   */
  @Patch('edit')
  @Security('jwt_token')
  @SuccessResponse('200', '게시글 수정 성공')
  @Response<ITsoaErrorResponse>('401', '게시글 수정 권한이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-06',
      reason: '게시글 수정 권한이 없습니다.',
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
  @Response<ITsoaErrorResponse>('404', '게시글이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-01',
      reason: '게시글이 없습니다.',
      data: null
    },
    success: null
  })
  public async editThread(
    @Request() req: ExpressRequest,
    @Body() body: {
      threadId: string;
      threadTitle: string;
      threadBody: string;
      type: ThreadType;
      threadSubject: number[];
    }
  ): Promise<ITsoaSuccessResponse<string>>{
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    const verifyRequest: boolean = await checkThreadOwner(body.threadId, req.user.index);
    
    if(!verifyRequest) {
      throw new ThreadUnauthorizedError(`게시글 수정 권한이 없습니다. ID: ${body.threadId}`);
    }

    const result = await this.ThreadService.threadEditService(body);

    return new TsoaSuccessResponse<string>(result);
  }

  /**
   * 게시글 삭제 API
   * @param threadId - 삭제할 게시글의 ID
   * @summary 게시글 삭제
   * @returns 삭제된 게시글의 ID
   * 
   */
  @Delete('delete')
  @Security('jwt_token')
  @SuccessResponse('200', '게시글 삭제 성공')
  @Response<ITsoaErrorResponse>('401', '게시글 삭제 권한이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-06',
      reason: '게시글 삭제 권한이 없습니다.',
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
  @Response<ITsoaErrorResponse>('500', '게시글 트랜잭션 처리에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-03',
      reason: '게시글 트랜잭션 처리에 실패했습니다.',
      data: null
    },
    success: null
  })
  public async deleteThread(
    @Request() req: ExpressRequest,
    @Query() threadId: string
  ): Promise<ITsoaSuccessResponse<string>> { 
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    if(threadId === undefined || threadId === null) {
      throw new ThreadNoID('게시글 ID가 없습니다.');
    }

    const verifyRequest: boolean = await checkThreadOwner(threadId, req.user.index);
    
    if(!verifyRequest) {
      throw new ThreadUnauthorizedError(`게시글 삭제 권한이 없습니다. ID: ${threadId}`);
    }

    const result = await this.ThreadService.threadDeleteService(threadId);

    return new TsoaSuccessResponse<string>(result);
  }

  /**
   * 게시글 스크랩 API
   * 
   * @param threadId - 스크랩할 게시물 ID
   * 
   * @example threadId "312be12e-df91-4213-9801-4a8aaa9139c6"
   * @returns 스크랩 성공 문구
   * @summary 게시물 스크랩
   * 
   */
  @Post('scrap')
  @Security('jwt_token')
  @SuccessResponse('200', '게시글 스크랩 성공')
  @Response<ITsoaErrorResponse>('400', '유저 인증 정보가 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: '유저 인증 정보가 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('400', '게시글 ID가 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-04',
      reason: '게시글 ID가 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('500', '게시글 스크랩에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-09',
      reason: '게시글 스크랩에 실패했습니다.',
      data: null
    },
    success: null
  })
  public async scrapThread(
    @Request() req: ExpressRequest,
    @Query() threadId: string
  ): Promise<ITsoaSuccessResponse<string>> {
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    if(threadId === undefined || threadId === null) {
      throw new ThreadNoID('게시글 ID가 없습니다.');
    }

    const result = await this.ThreadService.threadScrapService(threadId, req.user.index);

    return new TsoaSuccessResponse<string>(`게시글 ${threadId} 스크랩 성공`);
  }

  /**
   * 게시글 댓글 작성 API
   * @param body - 댓글 작성 정보
   * @param body.threadId - 댓글을 작성할 게시글 ID
   * @param body.commentBody - 댓글 내용
   * @param body.quote - 댓글 인용 ID (선택 사항)
   * @description 게시글에 댓글을 작성합니다.
   * @example
   * {
   *  "threadId": "312be12e-df91-4213-9801-4a8aaa9139c6",
   *  "commentBody": "이 게시글에 대한 댓글입니다.",
   *  "quote": 1
   * }
   * @returns 작성된 댓글 정보
   * @summary 게시글 댓글 작성
   */
  @Post('postComment')
  @Security('jwt_token')
  @SuccessResponse('200', '게시글 댓글 작성 성공')
  @Response<ITsoaErrorResponse>('400', '유저 인증 정보가 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: '유저 인증 정보가 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>('400', '게시글 ID 또는 댓글 내용이 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-04',
      reason: '게시글 ID 또는 댓글 내용이 없습니다.',
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
  @Response<ITsoaErrorResponse>('500', '댓글 작성에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'THR-08',
      reason: '댓글 작성에 실패했습니다.',
      data: null
    },
    success: null
  })
  public async commentThread(
    @Request() req: ExpressRequest,
    @Body() body: {
      threadId: string;
      commentBody: string;
      quote?: number;
    }
  ): Promise<ITsoaSuccessResponse<ResponseFromPostComment>> {
    if(!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    if(!body.threadId || !body.commentBody) {
      throw new ThreadNoID('게시글 ID 또는 댓글 내용이 없습니다.');
    }

    const result = await this.ThreadService.threadPostCommentService(body, req.user.index);
    
    return new TsoaSuccessResponse<ResponseFromPostComment>(result);
  }

  /**
   * 게시글 댓글 조회 API
   * @param threadId - 댓글을 조회할 게시글 ID
   * @summary 게시글 댓글 조회
   */
  @Get('getComment')
  @SuccessResponse('200', '게시글 댓글 조회 성공')
  @Response('400', '게시글 ID가 없습니다.', {
    resultType:'FAIL',
    error: {
      errorCode: 'THR-04',
      reason: '게시글 ID가 없습니다.',
      data: null
    },
    success: null
  })
  public async getComment (
    @Query() threadId: string
  ): Promise<ITsoaSuccessResponse<ResponseFromGetComment[]>> {
    if(threadId === undefined || threadId === null) {
      throw new ThreadNoID('게시글 ID가 없습니다.');
    }
    
    const result = await this.ThreadService.threadGetCommentService(threadId);

    return new TsoaSuccessResponse<ResponseFromGetComment[]>(result);
  }

  /**
   * 게시글 좋아요 API
   * 
   * @param threadId - 좋아요 할 게시글 ID
   * 
   * @returns 좋아요 성공 문구
   */
  @Post('/like')
  @SuccessResponse('200', '게시글 좋아요 성공')
  public async likeThread(
    @Request() req: ExpressRequest,
    @Query() threadId: string
  ): Promise<ITsoaSuccessResponse<string>> {
    if(!req.user || !req.user.index){
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    if(threadId === undefined || threadId === null) {
      throw new ThreadNoID('게시글 ID가 없습니다.');
    }

    const result = await this.ThreadService.threadLikeService(threadId, req.user.index);

    return new TsoaSuccessResponse<string>(result);
  }
}
