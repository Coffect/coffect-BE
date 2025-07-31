import { Body, Controller, Get, Post, Route, SuccessResponse, Tags, Response, Request, Middlewares, Query, Patch } from 'tsoa';
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

  @Get('currentCardRecommend')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 Data를 불러왔습니다.')
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
      public async currentCardRecommend (
        @Request() req: ExpressRequest
      ):Promise<ITsoaSuccessResponse<coffectChatCardDTO>> {
        const userId = req.decoded.index;

        const result = await this.homeService.currentCardRecommendService(userId);

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

  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 커피챗 일정등록 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Patch('fixCoffeeChatSchedule')
  @Middlewares(verify)
  @SuccessResponse('200', '정상적으로 커피챗 일정을 수정하였습니다다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE402',
        reason: '내용이 누락되었습니다.',
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
  public async fixCoffeeChatSchedule (
    @Request() req: ExpressRequest,
    @Body() body: { 
      coffectId : number;
      coffeeDate: Date;
      location: string;
      time: Date;
    },
  ):Promise<ITsoaSuccessResponse<string>> { 
    const userId = req.decoded.index;
    const { coffectId, coffeeDate, location, time } = body;
    
    if(coffectId === null) {
      throw new nonPostComment('커피챗 일정 번호가 누락되었습니다.');
    } else if(coffeeDate === null) {
      throw new nonPostComment('일정이 누락되었습니다.');
    } else if(location === null ) {
      throw new nonPostComment('위치가 누락되었습니다.');
    } else if(time === null) {
      throw new nonPostComment('시간이 누락되었습니다.');
    }

    const result = await this.homeService.fixCoffeeChatScheduleService(userId, coffectId,coffeeDate, location, time);

    return new TsoaSuccessResponse<string>('정상적으로 커피챗 일정을 등록했습니다.');
  };

  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 커피챗 승낙 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
  @Patch('acceptCoffeeChat')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 커피챗을 승낙했습니다.')
  @Response<ITsoaErrorResponse> (
    400, 
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'HE404',
        reason: '존재하지 않는 커피챗 일정입니다.',
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
  public async acceptCoffeeChat(
      @Request() req: ExpressRequest,
      @Body() body: {
        coffectId : number;
      },
  ):Promise<ITsoaSuccessResponse<string>> {
    const userId = req.decoded.index;
    const { coffectId } = body;

    if(coffectId === null) {
      throw new nonData('존재하지 않는 커피챗입니다.');
    }

    await this.homeService.acceptCoffeeChatService(userId, coffectId);

    return new TsoaSuccessResponse<string>('정상적으로 커피챗을 승낙했습니다.');
  };

  /**
   * Coffect coffeeChat Home API.
   * 
   * @summary 스케줄러를 수동으로 실행하는 API (개발/테스트용)
   * @returns 요청 성공 여부
   */
  @Post('resetDailyFields')
  @Middlewares(verify)
  @SuccessResponse('200', '성공적으로 daily 필드를 초기화했습니다.')
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
  public async resetDailyFieldsController(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    
    await this.homeService.resetDailyFieldsService();

    return new TsoaSuccessResponse<string>('성공적으로 daily 필드를 초기화했습니다.');
  };
}