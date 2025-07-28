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
  Security
} from 'tsoa';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ProfileService } from './profile.Service';
import { ProfileDTO } from '../middleware/profile.DTO/temp.DTO';
@Route('profile')
@Tags('Profile Controller')
export class ProfileController extends Controller {
  private profileService: ProfileService;
  constructor() {
    super();
    this.profileService = new ProfileService();
  }

  /**
   * 유저의 기본적인 프로필
   * 쓰레드수, 팔로잉, 팔로워, 유저정보를 반환한다
   *
   * @summary 유저 프로필 조회
   *
   */
  @Get('/')
  @Response(200, '조회성공')
  @Response<ITsoaErrorResponse>(500, '서버에러', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: 'Unknown server error.',
      data: null
    },
    success: null
  })
  @Security('jwt_token')
  public async myprofile(
    @Request() req: Express.Request
  ): Promise<ITsoaSuccessResponse<ProfileDTO>> {
    const userId = req.user.index;
    const data = await this.profileService.myProfile(userId);
    return new TsoaSuccessResponse(data);
  }
}
