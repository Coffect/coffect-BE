import { Body, Controller, Get, Middlewares, Post, Query, Request, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';
import { ITsoaErrorResponse, TsoaSuccessResponse } from '../config/tsoaResponse';
import verify from '../middleware/verifyJWT';
import { Request as ExpressRequest } from 'express';
import { followMySelf, nonProfile, nonUser } from './follow.Message';
import { FollowService, specifyProfileService } from './follow.Service';
import { specifyFeedDTO, specifyProfileDTO } from '../middleware/follow.DTO/follow.DTO';

@Route('follow')
@Tags('Follow Controller')
export class FollowController extends Controller {
  private FollowService : FollowService;

  constructor () {
    super();
    this.FollowService = new FollowService();
  }

    /**
   * Coffect coffeeChat Follow API.
   * 
   * @summary Follow API
   * @param body 유저 Token & follow 거는 userId
   * @returns 요청 성공 여부
   */
    @Post('followRequest')
    @Security('jwt_token')
    @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
    @Response<ITsoaErrorResponse> (
      400,
      'Bad Request',
      {
        resultType : 'FAIL',
        error: {
          errorCode: 'FE400',
          reason: '팔로우에 실패하였습니다.',
          data: null
        },
        success: null
      })
    @Response<ITsoaErrorResponse> (
      400,
      'Bad Request',
      {
        resultType : 'FAIL',
        error: {
          errorCode: 'FE401',
          reason: '자기 자신을 팔로우 할 수 없습니다',
          data: null
        },
        success: null
      })
      @Response<ITsoaErrorResponse> (
        404,
        'Bad Request',
        {
          resultType : 'FAIL',
          error: {
            errorCode: 'FE404',
            reason: '상대방 UserId가 존재하지 않습니다.',
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
  public async FollowRequest(
        @Request() req : ExpressRequest,
        @Body() body: {
            oppentUserId: number;
        }  
  ):Promise<TsoaSuccessResponse<string>> {
    const userId = req.user.index;
    const {oppentUserId }= body;

    if(oppentUserId == undefined || !oppentUserId) {
      throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
    }

    if(oppentUserId === userId) {
      throw new followMySelf('자기 자신을 팔로우 할 수 없습니다.');
    }

    await this.FollowService.FollowRequestService(userId, oppentUserId);

    return new TsoaSuccessResponse<string>('Follow를 걸었습니다!');
  };


   /**
   * Coffect coffeeChat Follow API.
   * 
   * @summary 해당 userId에 맞는 Follower & Following 수 보는 API
   * @param body 유저 Token
   * @returns 요청 성공 여부
   */
   @Get('showUpFollowCount')
   @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
   @Response<ITsoaErrorResponse> (
     400,
     'Bad Request',
     {
       resultType : 'FAIL',
       error: {
         errorCode: 'FE400',
         reason: '팔로우에 실패하였습니다.',
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
    public async ShowUpFollowCount(
      @Query() userId: number
    ):Promise<TsoaSuccessResponse<number[]>> {
      if(userId == undefined || !userId) {
        throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
      }

      const result = await this.FollowService.ShowUpFollowCountService(userId);

      return new TsoaSuccessResponse<number[]>(result);
    };


   /**
   * Coffect coffeeChat Follow API.
   * 
   * @summary 상대방 페이지에서 내가 상대를 팔로우 했는지 안했는지 확인하는 API
   * @param body 유저 Token & 상대방 UserId
   * @returns 요청 성공 여부
   */
   @Get('isFollow')
   @Security('jwt_token')
   @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
   @Response<ITsoaErrorResponse> (
     400,
     'Bad Request',
     {
       resultType : 'FAIL',
       error: {
         errorCode: 'FE400',
         reason: '상대방 UserId가 존재하지 않거나 누락되었습니다.',
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
   public async isFollow(
      @Request() req : ExpressRequest,
      @Query() oppentUserId : number
   ):Promise<TsoaSuccessResponse<boolean>> {

     const userId = req.user.index; 

     if(oppentUserId == undefined || !oppentUserId) {
       throw new nonUser('상대방 UserId가 존재하지 않거나 누락되었습니다.');
     }

     const result = await this.FollowService.isFollowService(userId, oppentUserId);

     return new TsoaSuccessResponse<boolean>(result);
   };
}

@Route('specifyProfile')
@Tags('specifyProfile Controller')
export class specifyProfileController extends Controller {
  private specifyProfileService : specifyProfileService;

  constructor() {
    super();
    this.specifyProfileService = new specifyProfileService();
  }

  /**
   * Coffect coffeeChat Profile API.
   * 
   * @summary 프로필 조회 API
   * @param body 유저 Token & 해당 UserId
   * @returns 요청 성공 여부
   */
  @Get('showProfile')
  @Security('jwt_token')
  @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
  @Response<ITsoaErrorResponse> (
    400,
    'Bad Request',
    {
      resultType : 'FAIL',
      error : {
        errorCode : 'PE400',
        reason : '프로필 조회에 실패하였습니다.',
        data : null
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
  public async showProfile(
      @Request() req : ExpressRequest,
      @Query() userId: number
  ):Promise<TsoaSuccessResponse<specifyProfileDTO>> {
    if(userId == undefined || !userId) {
      throw new nonProfile('상대방 Id가 존재하지 않거나 누락되었습니다.');
    }

    const result = await this.specifyProfileService.showProfileService(userId);

    return new TsoaSuccessResponse<specifyProfileDTO>(result);
  };

  /**
   * Coffect coffeeChat Profile API.
   * 
   * @summary 전체적인 피드 조회 API
   * @param body 유저 Token & 해당 UserId
   * @returns 요청 성공 여부
   */
    @Get('showAllFeed')
    @Security('jwt_token')
    @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
    @Response<ITsoaErrorResponse>(
      400,
      'Bad Request',
      {
        resultType : 'FAIL',
        error : {
          errorCode : 'PE400',
          reason : '없는 유저입니다.',
          data : null
        },
        success : null
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
  public async showAllFeed(
        @Request() req : ExpressRequest,
        @Query() userId: number
  ):Promise<TsoaSuccessResponse<specifyFeedDTO[]>> {
    if(userId == undefined || !userId) {
      throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
    }

    const result = await this.specifyProfileService.showAllFeedService(userId);

    return new TsoaSuccessResponse<specifyFeedDTO[]>(result);
  };


    /**
   * Coffect coffeeChat Profile API.
   * 
   * @summary 피드 갯수 세는 API
   * @param body 유저 Token & 해당 UserId
   * @returns 요청 성공 여부
   */
    @Get('showFeedCount')
    @Security('jwt_token')
    @SuccessResponse('200', '성공적으로 Data를 넣었습니다.')
    @Response<ITsoaErrorResponse>(
      400,
      'Bad Request',
      {
        resultType : 'FAIL',
        error : {
          errorCode : 'PE400',
          reason : '없는 유저입니다.',
          data : null
        },
        success : null
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
    public async ShowFeedCount(
        @Request() req : ExpressRequest,
        @Query() userId: number
    ):Promise<TsoaSuccessResponse<number>> {
      if(userId == undefined || !userId) {
        throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
      }

      const result = await this.specifyProfileService.ShowFeedCountService(userId);

      return new TsoaSuccessResponse<number>(result);
    };
  
}