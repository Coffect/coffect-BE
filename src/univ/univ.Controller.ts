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

@Route('univ')
@Tags('대학 검색, 인증관련 api입니다')
export class UnivController extends Controller {
  public async search() {}

  @Post('cerfify')
  public async certify(
    @Request() req: ExpressRequest,
    @Body()
    body: {
      univMail: string;
    }
  ) {
    const univCert = await UnivService.certService(body.univMail);
    
  }
}
