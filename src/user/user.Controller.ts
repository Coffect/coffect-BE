import {
  Controller,
  Route,
  Post,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Response,
  Middlewares,
  Get
} from 'tsoa';
import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { UserService } from './user.Service';
import {
  UserLoginRequest,
  UserLoginResponse
} from '../middleware/user.DTO/user.DTO';
import { decodeToken } from '../config/token';

@Route('user')
@Tags('User Controller')
export class UserController extends Controller {
  // /**
  //  * Coffect API 테스트 중입니다.
  //  *
  //  * @summary Coffect BE Test
  //  * @param body 유저 정보
  //  * @returns 요청 성공 여부
  //  */
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

  /**
   * 토큰검증
   *
   * @summary 데이터베이스에 토큰이 존재하는지 검증하고, 유효할 경우 새로운 토큰을 발급해준다.
   * @returns accessToken, refreshToken
   */
  @Get('refresh')
  @SuccessResponse(200, '토큰 재발급')
  @Response<ITsoaErrorResponse>(400, '헤더 누락값 존재', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '누락값이 존재합니다.',
      data: '헤더에 토큰이 존재하지 않습니다.'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(401, 'jwt 토큰 만료', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: 'Expired',
      data: {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: '2025-07-14T01:29:15.000Z'
      }
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(404, '로그인 정보 없음', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: 'JsonWebToken error',
      data: 'DB에 사용자 로그인 정보가 존재하지 않습니다. 다시 로그인해주세요'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(404, '엑세스 토큰을 보냄', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: 'JsonWebToken error',
      data: {
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      }
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(404, '일치하지 않는 토큰 사용', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-1',
      reason: 'JsonWebToken error',
      data: {
        statusCode: 404,
        code: 'ERR-1',
        description: '유효하지 않은 토큰입니다.'
      }
    },
    success: null
  })
  public async refresh(
    @Request() req: ExpressRequest
  ): Promise<ITsoaSuccessResponse<UserLoginResponse>> {
    const tokenCheck = await UserService.refreshService(req);
    return new TsoaSuccessResponse(tokenCheck);
  }
}
