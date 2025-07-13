import {
  Controller,
  Route,
  Post,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Response,
  Middlewares
} from 'tsoa';
import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { UserService } from './user.Service';
import verifyToken from '../middleware/verifyJWT';
import {
  UserLoginRequest,
  UserLoginResponse
} from '../middleware/user.DTO/user.DTO';

@Route('user')
@Tags('User Controller')
export class UserController extends Controller {
  /**
   * Coffect API 테스트 중입니다.
   *
   * @summary Coffect BE Test
   * @param body 유저 정보
   * @returns 요청 성공 여부
   */
  // @Post('userInfo')
  // @SuccessResponse('200', 'API 테스트 성공.')
  // @Response<ITsoaErrorResponse>(400, 'Bad Request', {
  //   resultType: 'FAIL',
  //   error: {
  //     errorCode: 'EC400',
  //     reason: '회원 정보를 입력하지 않은 유저입니다.',
  //     data: null
  //   },
  //   success: null
  // })
  // @Response<ITsoaErrorResponse>(500, 'Internal Server Error', {
  //   resultType: 'FAIL',
  //   error: {
  //     errorCode: 'EC500',
  //     reason: '서버 오류가 발생했습니다.',
  //     data: null
  //   },
  //   success: null
  // })
  // public async testuserInfo(
  //   @Request() req: ExpressRequest,
  //   @Body()
  //   body: {
  //     userName: string;
  //   }
  // ): Promise<ITsoaSuccessResponse<string>> {
  //   const user: string = body.userName;

  //   if (user === null || user === '') {
  //     throw new UserNotSignUpError('유저 정보가 없습니다.');
  //   }

  //   return new TsoaSuccessResponse<string>('API 테스트 중입니다.');
  // }

  /**
   * 로그인
   *
   * @summary 로그인
   * @param body 유저아이디, 비밀번호
   * @returns accessToken, refreshToken
   */
  @Post('login')
  @SuccessResponse(200, '로그인성공')
  @Response<ITsoaErrorResponse>(404, '존재하지 않는 아이디', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '존재하지 않는 아이디입니다',
      data: '존재하지 않는 아이디입니다'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(400, '비밀번호 불일치', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC405',
      reason: '비밀번호가 일치하지 않습니다',
      data: '비밀번호가 일치하지 않습니다'
    },
    success: null
  })
  public async login(
    @Request() req: ExpressRequest,
    @Body()
      body: {
      userPassword: string;
      userId: string;
    }
  ): Promise<ITsoaSuccessResponse<UserLoginResponse>> {
    const userid = body.userId;
    const userPassword = body.userPassword;
    const userLogin = new UserLoginRequest(userid, userPassword, req);

    const loginResult = await UserService.loginService(userLogin);
    return new TsoaSuccessResponse(loginResult);
  }

  @Post('refresh')
  @Middlewares(verifyToken)
  public async refresh(
    @Request() req: ExpressRequest,
    @Body() body: { token: string }
  ): Promise<ITsoaSuccessResponse<string>> {
    const decoded = req.decoded;
    const tokenCheck = await UserService.refreshService(decoded);
    return new TsoaSuccessResponse<string>('test');
  }
}
