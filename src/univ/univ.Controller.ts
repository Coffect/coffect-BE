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
import {
  DeptSearchResponse,
  UnivCertRequest,
  UnivSearchResponse
} from '../middleware/univ.DTO/univ.DTO';

@Route('univ')
@Tags('Univ Controller')
export class UnivController extends Controller {
  private univService: UnivService;
  constructor() {
    super();
    this.univService = new UnivService();
  }

  @Post('dept')
  @SuccessResponse(200, '검색 성공')
  public async dept(
    @Request() req: ExpressRequest,
    @Body() body: { univName: string; search: string }
  ): Promise<ITsoaSuccessResponse<DeptSearchResponse>> {
    const data = await this.univService.deptService(body.search, body.univName);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 대학교를 검색한다
   *
   * @summary 대학교 검색
   */
  @Post('search')
  @SuccessResponse(200, '검색 성공')
  @Response<ITsoaErrorResponse>(500, '서버에러', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: 'Unknown server error.',
      data: null
    },
    success: null
  })
  public async search(
    @Request() req: ExpressRequest,
    @Body() body: { univName: string }
  ): Promise<TsoaSuccessResponse<UnivSearchResponse>> {
    const data = await this.univService.searchService(body.univName);
    return new TsoaSuccessResponse(data);
  }

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
    const info = new UnivCertRequest(body.certCode, body.email);
    await this.univService.certService(info);
    return new TsoaSuccessResponse('인증에 성공했습니다.');
  }
}
