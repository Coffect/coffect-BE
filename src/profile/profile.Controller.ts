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
  Security,
  Patch,
  Example
} from 'tsoa';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ProfileService } from './profile.Service';
import {
  ProfileDTO,
  ProfileUpdateDTO
} from '../middleware/profile.DTO/temp.DTO';
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
  public async myProfile(
    @Request() req: Express.Request
  ): Promise<ITsoaSuccessResponse<ProfileDTO>> {
    const userId = req.user.index;
    const data = await this.profileService.myProfile(userId);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 유저의 프로필을 수정한다
   * 이름, 아이디, 소개글을 수정한다. req.body는 수정하지 않는값이어도 '' 으로 문자열 넘겨야한다. 이때 공백값이 들아온다면 공백값으로 수정된다.
   *
   * @summary 유저 프로필 수정
   *
   */
  @Patch('/')
  @Security('jwt_token')
  @Response(200, '프로필 수정 성공')
  @Response<ITsoaErrorResponse>(409, '중복된 아이디', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC409',
      reason: '이미 중복된 아이디입니다.',
      data: '아이디가 중복됨'
    },
    success: null
  })
  public async updateProfile(
    @Request() req: Express.Request,
    @FormField() id?: string,
    @FormField() name?: string,
    @FormField() introduce?: string,
    @UploadedFile() img?: Express.Multer.File
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    const info = new ProfileUpdateDTO(userId, id, name, introduce, img);
    await this.profileService.updateProfile(info);
    return new TsoaSuccessResponse('ok');
  }
}
