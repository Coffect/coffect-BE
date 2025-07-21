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
import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserSignUpResponse
} from '../middleware/user.DTO/user.DTO';
import { decodeToken } from '../config/token';
import verify from '../middleware/verifyJWT';
import { UnivService } from './univ.Service';
import { UnivCertRequest } from '../middleware/univ.DTO/univ.DTO';

@Route('univ')
@Tags('Univ Controller')
export class UnivController extends Controller {
  private univService: UnivService;
  constructor() {
    super();
    this.univService = new UnivService();
  }
  public async search() {}

  /**
   * 메일 인증번호가 일치하는지 확인한다
   *
   * @summary 이메일 인증번호 확인
   */
  @Post('cert')
  @SuccessResponse(200, '인증에 성공했습니다')
  @Response<ITsoaErrorResponse>(401, '인증코드가 일치하지 않습니다', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC1',
      reason: '인증코드가 일치하지 않습니다.',
      data: '인증코드가 일치하지 않습니다.'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(401, '인증코드가 유효하지 않습니다', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC2',
      reason: '인증코드가 유효하지 않습니다.',
      data: '인증코드가 유효하지 않습니다.'
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(401, '인증코드가 만료되었습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC3',
      reason: '인증코드가 만료되었습니다,',
      data: '인증코드가 만료되었습니다.'
    },
    success: null
  })
  public async cert(
    @Request() req: ExpressRequest,
    @Body()
      body: {
      certCode: number;
      email: string;
    }
  ): Promise<ITsoaSuccessResponse<string>> {
    const info = new UnivCertRequest(req.body.certCode, req.body.email);
    await this.univService.certService(info);
    return new TsoaSuccessResponse('인증에 성공했습니다.');
  }
}
