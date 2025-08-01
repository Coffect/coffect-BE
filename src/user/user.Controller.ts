import {
  Controller,
  Route,
  Post,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Response,
  Get,
  FormField,
  UploadedFile,
  Example
} from 'tsoa';
import { Request as ExpressRequest } from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { UserService } from './user.Service';
import {
  UserLoginBody,
  UserLoginRequest,
  UserLoginResponse,
  UserSignUpRequest,
  UserSignUpResponse
} from '../middleware/user.DTO/user.DTO';

@Route('user')
@Tags('User Controller')
export class UserController extends Controller {
  private userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }
  /**
   * 로그인
   *
   * @summary 로그인
   * @param body 유저아이디, 비밀번호
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
    @Body() body: UserLoginBody
  ): Promise<ITsoaSuccessResponse<UserLoginResponse>> {
    const userid = body.userId;
    const userPassword = body.userPassword;
    const userLogin = new UserLoginRequest(userid, userPassword, req);

    const loginResult = await this.userService.loginService(userLogin);
    return new TsoaSuccessResponse(loginResult);
  }

  /**
   *  Header authorization에 리프레시 토큰을 담아 전송한다.
   *  데이터베이스에 토큰이 존재하는지 검증하고, 유효할 경우 새로운 토큰을 발급해준다.'
   *
   * @summary 토큰검증
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
    const tokenCheck = await this.userService.refreshService(req);
    return new TsoaSuccessResponse(tokenCheck);
  }

  /**
   * 회원가입 정보를 form-data로 보낸다.
   * @param id 아이디
   * @param password 비밀번호
   * @param name 이름
   * @param email 이메일
   * @param univId 대학교 고유 번호
   * @param dept 학과
   * @param studentId 입학년도
   * @param img 프로필 사진
   * @param interest 관심사
   * @summary 회원가입
   */
  @Post('signup')
  @SuccessResponse(200, '회원가입 성공')
  @Response<ITsoaErrorResponse>(500, '데이터베이스 삽입 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC500',
      reason: '서버 오류가 발생했습니다.',
      data: '데이터베이스 삽입에 실패했습니다.'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(500, '데이터베이스 삽입 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR2',
      reason: '서버에 사진을 올리는중 오류가 발생했습니다.',
      data: '사진을 올리는 중 오류가 발생했습니다'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(409, '중복된 아이디', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC409',
      reason: '이미 중복된 아이디입니다.',
      data: '아이디가 중복됨'
    },
    success: null
  })
  public async signup(
    @Request() req: ExpressRequest,
    @FormField() id: string,
    @FormField() password: string,
    @FormField() name: string,
    @FormField() email: string,
    @FormField() univId: number,
    @FormField() dept: string,
    @FormField() studentId: number,
    @UploadedFile() img: Express.Multer.File,
    @FormField() interest?: number[]
  ): Promise<ITsoaSuccessResponse<UserSignUpResponse>> {
    const singUpInfo = new UserSignUpRequest(req);
    await this.userService.signUpService(singUpInfo, img);
    return new TsoaSuccessResponse('회원가입 성공');
  }

  /**
   * 데이터베이스를 조회해 해당 아이디가 겹치는지 아닌지 확인한다.
   *
   * @summary 아이디 중복 체크
   */
  @Post('idcheck')
  @SuccessResponse(200, '존재하지 않는 아이디')
  @Response<ITsoaErrorResponse>(409, '중복된 아이디', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC409',
      reason: '이미 중복된 아이디입니다.',
      data: '아이디가 중복됨'
    },
    success: null
  })
  public async idcheck(
    @Request() req: ExpressRequest,
    @Body()
      body: {
      id: string;
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    await this.userService.idCheckService(body.id);
    return new TsoaSuccessResponse('존재하지 않는 아이디');
  }
}
