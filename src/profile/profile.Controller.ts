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
  Example,
  Path
} from 'tsoa';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ProfileService } from './profile.Service';
import {
  ProfileDTO,
  ProfileUpdateDTO,
  UpdateProfileBody
} from '../middleware/detailProfile.DTO/detailProfile.DTO';
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
   * @summary 본인 프로필 조회
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
   * 유저의 프로필을 조회한다
   * 조회하려는 유저의 아이디를 검색한다
   *
   * @summary 유저 프로필 조회
   * @param id 아이디
   */
  @Get('/{id}')
  @Response(200, '조회성공')
  public async getProfile(
    @Request() req: Express.Request,
    @Path() id: string
  ): Promise<ITsoaSuccessResponse<ProfileDTO>> {
    const data = await this.profileService.getProfile(id);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 유저의 프로필을 수정한다
   * 이름, 아이디, 소개글, 프로필사진을 수정한다. req.body는 수정하지 않는값이어도 빈칸으로 넘긴다. 이때 공백값이 들아온다면 공백값으로 수정된다.
   *
   * @summary 유저 프로필 수정
   * @param id 아이디
   * @param name 이름
   * @param introduce 소개글
   * @param img 프로필사진
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
  @Response<ITsoaErrorResponse>(500, '서버에러', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: 'Unknown server error.',
      data: null
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
    return new TsoaSuccessResponse('프로필 수정 성공');
  }

  /**
   * 유저의 관심사를 수정한다
   * 관심사는 카테고리 아이디 배열로 수정한다.
   * 수정하는 하려는 값은 추가된 관심사 뿐만 아니라 모든 정보를 보내준다.
   *
   * @summary 유저 관심사 수정
   * @param body 관심사 아이디 배열
   */
  @Patch('/interest')
  @Security('jwt_token')
  @Response(200, '관심사 수정 성공')
  @Response<ITsoaErrorResponse>(500, '서버에러', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: 'Unknown server error.',
      data: null
    },
    success: null
  })
  public async updateInterest(
    @Request() req: Express.Request,
    @Body() body: UpdateProfileBody
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    await this.profileService.updateInterest(userId, body.interest);
    return new TsoaSuccessResponse('관심사 수정 성공');
  }
}
