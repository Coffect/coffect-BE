import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Request
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { Request as ExpressRequest } from 'express';
import { postTodayError } from './coffeeChat.Message';
import { decodeToken } from '../config/token';
import { HomeService } from './coffeeChat.Service';

@Route('home')
@Tags('Home Controller')
export class HomeController extends Controller {
  private homeService: HomeService;

  constructor() {
    super();
    this.homeService = new HomeService();
  }

  /**
   * Coffect coffeeChat API 테스트 중입니다.
   *
   * @summary postTodayInterest TEST
   * @param body 유저 Token & 하루 관심사 정보 수정
   * @returns 요청 성공 여부
   */
  @Post('postTodayInterest')
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse>(400, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'HE400',
      reason: '주제 선정해주세요.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(500, 'Internal Server Error', {
    resultType: 'FAIL',
    error: {
      errorCode: 'HE500',
      reason: '서버 오류가 발생했습니다.',
      data: null
    },
    success: null
  })
  public async postTodayInterestController(
    @Request() req: ExpressRequest,
    @Body()
      body: {
      userId: number;
      todayInterest: number;
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    const todayInterestIndex: number = body.todayInterest;

    const token = req.headers.authorization?.split(' ')[1] as string;
    const userId = 1 as number; // 임시 토큰 값
    // await decodeToken(token).userId as number;

    if (todayInterestIndex === null || todayInterestIndex === undefined) {
      throw new postTodayError('주제를 선정하지 않았습니다.');
    }

    await this.homeService.postTodayInterestService(userId, todayInterestIndex);

    return new TsoaSuccessResponse<string>('성공적으로 Data를 넣었습니다.');
  }
}
