import {
  Controller,
  Route,
  Post,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Response
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { ErrorMessage, userError } from '../user.Message/user.Message';

@Route('user')
@Tags('User Controller')
export class UserController extends Controller{
  /**
   * Coffect API 테스트 중입니다.
   * 
   * @summary Coffect BE Test
   * @param body 유저 정보
   * @returns 요청 성공 여부
   */
  @Post('userInfo')
  @SuccessResponse('200', 'OK', 'API 테스트 중입니다.')
  @Response<ErrorMessage>(
    400,
    'Bad Request', 
    {
      statusCode: 400,
      customCode: 'EC400',
      message: '회원 정보를 입력하지 않은 유저입니다.'
    }
  )
  @Response<ErrorMessage>(
    500,
    'Internal Server Error', 
    {
      statusCode: 500,
      customCode: 'EC500',
      message: '서버 에러입니다.'
    }
  )
  public async testuserInfo (
    @Request() req: ExpressRequest,
    @Body() body: {
      userName: string
    }
  ): Promise<string> {
    try {
      const user = body.userName;

      if(!user) {
        throw userError.notSignUp;
      }

    } catch (error : any) {
      throw userError.serverError;
    }

    return 'API Test 중입니다.';
  };
};
