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
import {
  UserNotSignUpError, 
  UserForbiddenError, 
  UserMissingFieldError, 
  UserUnauthorizedError,
  UserServerError
} from '../user.Message/user.Message';

import { 
  ITsoaErrorResponse, 
  ITsoaSuccessResponse, 
  TsoaSuccessResponse 
} from '../../config/tsoaResponse';

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
  @SuccessResponse('200', 'API 테스트 성공.')
  @Response<ITsoaErrorResponse>(
    400,
    'Bad Request', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'EC400',
        reason: '회원 정보를 입력하지 않은 유저입니다.',
        data: null
      },
      success: null
    }
  )
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'EC500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    }
  )
  public async testuserInfo (
    @Request() req: ExpressRequest,
    @Body() body: {
      userName: string
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    const user: string = body.userName;

    if(user === null || user === '') {
      throw new UserNotSignUpError('유저 정보가 없습니다.');
    }

    return new TsoaSuccessResponse<string>('API 테스트 중입니다.');
  };
};