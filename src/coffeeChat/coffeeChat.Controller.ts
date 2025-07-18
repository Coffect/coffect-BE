import { Body, Controller, Get, Post, Route, SuccessResponse, Tags, Response, Request, Middlewares } from 'tsoa';
import { ITsoaErrorResponse, ITsoaSuccessResponse, TsoaSuccessResponse } from '../config/tsoaResponse';
import { Request as ExpressRequest } from 'express';
import { exceedLimitError, postTodayError } from './coffeeChat.Message';
import { decodeToken } from '../config/token';
import { HomeService } from './coffeeChat.Service';
import { verify } from 'crypto';
import { coffectChatCardDTO } from '../middleware/coffectChat.DTO/coffectChat.DTO';

@Route('home')
@Tags('Home Controller')
export class HomeController extends Controller {
  private homeService : HomeService;

  constructor () {
    super();
    this.homeService = new HomeService();
  }

  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 매일 커피챗 추천 항목을 받는 API (가까운 거리 순 <1>, 나와 비슷한 관심사 <2>, 같은 학번 <3>, 최근에 글을 쓴 사람 <4>)
   * @param body 유저 Token & 하루 관심사 정보 수정
   * @returns 요청 성공 여부
   */
  @Post('postTodayInterest')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE400',
        reason: '주제 선정해주세요.',
        data: null
      },
      success: null
    })
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
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
    @Body() body: { 
      userId : number;
      todayInterest: number;
    },
  ): Promise<ITsoaSuccessResponse<string>> {
    
    const todayInterestIndex : number = body.todayInterest;
    const userId = req.decoded.index as number;
    // await decodeToken(token).userId as number;

    if(todayInterestIndex === null || todayInterestIndex === undefined) {
      throw new postTodayError('주제를 선정하지 않았습니다.');
    }

    await this.homeService.postTodayInterestService(userId, todayInterestIndex);

    return new TsoaSuccessResponse<string>('성공적으로 Data를 넣었습니다.');
  };


  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 카드를 가져오는 API (가까운 거리 순 <1>, 나와 비슷한 관심사 <2>, 같은 학번 <3>, 최근에 글을 쓴 사람 <4>)
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Get('getCardClose')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE400',
        reason: '주제 선정해주세요.',
        data: null
      },
      success: null
    })
    @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE401',
        reason: '오늘 하루 추천 커피챗 횟수를 초과 했습니다.',
        data: null
      },
      success: null
    })
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async CardCloseCoffeeChatController (
    @Request() req: ExpressRequest
  ):Promise<ITsoaSuccessResponse<coffectChatCardDTO>> { 
    const userId = req.decoded.index as number;

    const result = await this.homeService.CardCoffeeChatService(userId);

    if (typeof result === 'number') {
      if (result === 400) {
        throw new postTodayError('주제 선정해주세요.');
      }
      
      if (result === 401 || result === 0) {
        throw new exceedLimitError('오늘 하루 추천 커피챗 횟수를 초과 했습니다.');
      }
      
      // 기타 숫자 값들
      throw new Error('서버 오류가 발생했습니다.');
    }

    return new TsoaSuccessResponse<coffectChatCardDTO>(result);
  };
}