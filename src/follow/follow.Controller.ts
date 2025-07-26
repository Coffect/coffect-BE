import { Body, Controller, Get, Middlewares, Post, Request, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { ITsoaErrorResponse, TsoaSuccessResponse } from '../config/tsoaResponse';
import verify from '../middleware/verifyJWT';
import { Request as ExpressRequest } from 'express';
import { nonUser } from './follow.Message';
import { FollowService } from './follow.Service';

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
    @Middlewares(verify)
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
  public async FollowRequest(
        @Request() req : ExpressRequest,
        @Body() body: {
            oppentUserId: number;
        }  
  ):Promise<TsoaSuccessResponse<string>> {
    const userId = req.decoded.index;
    const {oppentUserId }= body;

    if(oppentUserId == undefined || !oppentUserId) {
      throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
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
       @Body() body :{
          userId : number;
       }
 ):Promise<TsoaSuccessResponse<number[]>> {
   const {userId} = body;

   if(userId == undefined || !userId) {
    throw new nonUser('상대방 Id가 존재하지 않거나 누락되었습니다.');
   }

   const result = await this.FollowService.ShowUpFollowCountService(userId);

   return new TsoaSuccessResponse<number[]>(result);
 };
}