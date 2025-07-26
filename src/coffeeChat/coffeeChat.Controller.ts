import { Body, Controller, Get, Post, Route, SuccessResponse, Tags, Response, Request, Middlewares, Query } from 'tsoa';
import { ITsoaErrorResponse, ITsoaSuccessResponse, TsoaSuccessResponse } from '../config/tsoaResponse';
import { Request as ExpressRequest } from 'express';
import { exceedLimitError, nonData, nonPostComment, postTodayError } from './coffeeChat.Message';
import { HomeService } from './coffeeChat.Service';
import verify from '../middleware/verifyJWT';
import { coffectChatCardDTO, CoffeeChatRecord, CoffeeChatRecordDetail, CoffeeChatSchedule } from '../middleware/coffectChat.DTO/coffectChat.DTO';

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
      todayInterest: number;
    },
  ): Promise<ITsoaSuccessResponse<string>> {
    
    const todayInterestIndex : number = body.todayInterest;
    const userId = req.decoded.index;
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
    const userId = req.decoded.index;

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


  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 커피챗 제안 요청하는 API
   * @param body
   * @returns 요청 성공 여부
   */
  @Post('postSuggestCoffeeChat')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse>(
    400,
    'Bad Request',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE402',
        reason: '내용이 누락되어있습니다.',
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
  public async postSuggestCoffeeChat(
    @Request() req: ExpressRequest,
    @Body() body: { 
      otherUserid : number;
      suggestion: string;
    },
  ): Promise<ITsoaSuccessResponse<string>> {
    const myUserId = req.decoded.index; // 내 userId
    const { otherUserid, suggestion } = body;

    if (!suggestion || suggestion.trim().length === 0) {
      throw new nonPostComment('커피챗 제안 내용이 누락되었습니다.');
    }

    await this.homeService.postSuggestCoffeeChatService(myUserId, otherUserid, suggestion);

    return new TsoaSuccessResponse<string>('정상적으로 커피챗 제안을 전송했습니다.');
  };



  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 커피챗 일정 가져오는 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Get('getCoffeeChatSchedule')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE404',
        reason: '에정된 커피챗 일정이 없습니다.',
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
  public async GetCoffeeChatSchedule (
    @Request() req: ExpressRequest
  ):Promise<ITsoaSuccessResponse<CoffeeChatSchedule[]>> { 
    const userId = req.decoded.index;

    const result = await this.homeService.GetCoffeeChatScheduleService(userId);

    return new TsoaSuccessResponse<CoffeeChatSchedule[]>(result);
  };


  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 나의 커피챗 기록 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Get('getPastCoffeeChat')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE404',
        reason: '커피챗 기록이 존재하지 않습니다.',
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
  public async getPastCoffeeChat (
    @Request() req: ExpressRequest
  ):Promise<ITsoaSuccessResponse<CoffeeChatRecord[]>> { 
    const userId = req.decoded.index;

    const result = await this.homeService.getPastCoffeeChatService(userId);

    if(result.length === 0) {
      throw new nonData('커피챗 기록이 존재하지 않습니다.');
    }

    return new TsoaSuccessResponse<CoffeeChatRecord[]>(result);
  };


  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 커피챗 기록에서 커피챗 상세 보기 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Get('getSpecifyCoffeeChat')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE404',
        reason: '커피챗 기록이 존재하지 않습니다.',
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
  public async getSpecifyCoffeeChat (
    @Request() req: ExpressRequest
  ):Promise<ITsoaSuccessResponse<CoffeeChatRecordDetail>> { 
    const userId = req.decoded.index;

    const result = await this.homeService.getSpecifyCoffeeChatService(userId);

    if(result === null) {
      throw new nonData('커피챗 기록이 존재하지 않습니다.');
    }

    return new TsoaSuccessResponse<CoffeeChatRecordDetail>(result);
  };

}