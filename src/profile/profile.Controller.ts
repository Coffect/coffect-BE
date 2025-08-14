import {
  Controller,
  Route,
  Tags,
  Request,
  Body,
  Response,
  Get,
  FormField,
  UploadedFile,
  Security,
  Patch,
  Query,
  SuccessResponse,
  Post,
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
  ProfileUpdateDTO,
  DetailProfileBody,
  UpdateProfileBody,
  AllProfileDTO
} from '../middleware/detailProfile.DTO/detailProfile.DTO';
import { UserUnauthorizedError } from '../user/user.Message';
import { ResponseFromThreadMainToClient } from '../middleware/thread.DTO/thread.DTO';
import {
  IsCoffeeChatDTO,
  SearchUserDTO
} from '../middleware/profile.DTO/profile.DTO';
@Route('profile')
@Tags('Profile Controller')
export class ProfileController extends Controller {
  private profileService: ProfileService;
  constructor() {
    super();
    this.profileService = new ProfileService();
  }

  /**
   * 본인의 기본적인 프로필
   * 쓰레드수, 팔로잉, 팔로워, 유저정보, 관심키워드를 반환한다
   *
   * @summary 본인 프로필 조회
   *
   */
  @Get('/')
  @SuccessResponse(200, '조회성공')
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
  ): Promise<ITsoaSuccessResponse<AllProfileDTO>> {
    const userId = req.user.index;
    const data = await this.profileService.myProfile(userId);
    return new TsoaSuccessResponse(data);
  }
  /**
   * 본인의 관심사를 수정한다
   * 관심사는 카테고리 아이디 배열로 수정한다.
   * 수정하는 하려는 값은 추가된 관심사 뿐만 아니라 모든 정보를 보내준다.
   *
   * @summary 본인 관심사 수정
   * @param body 관심사 아이디 배열
   */
  @Patch('/interest')
  @Security('jwt_token')
  @SuccessResponse(200, '관심사 수정 성공')
  @Response<ITsoaErrorResponse>(500, '서버에러', {
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: 'Unknown server error.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(409, '이미 중복된 아이디', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC409',
      reason: '이미 중복된 아이디입니다.',
      data: '아이디가 중복됨'
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

  /**
   * 본인의 게시글을 조회한다
   *
   * @summary 본인 게시글 조회
   */
  @Get('/mythread')
  @Security('jwt_token')
  @SuccessResponse(200, '게시글 조회 성공')
  public async getMyThread(
    @Request() req: Express.Request
  ): Promise<ITsoaSuccessResponse<ResponseFromThreadMainToClient[]>> {
    const userId = req.user.index;
    const data = await this.profileService.getThread(undefined, userId);
    return new TsoaSuccessResponse(data);
  }
  /**
   * 본인의 상세 프로필을 수정한다
   * 상새프로필은 json[] 형태로 구현하며, 수정되지 않는 정보도 같이 보낸다.
   *
   * @summary 본인 상세 프로필 수정
   * @param body 상세 프로필 배열
   */
  @Patch('/detail')
  @Security('jwt_token')
  @SuccessResponse(200, '상세 프로필 수정 성공')
  public async updateDetailProfile(
    @Request() req: Express.Request,
    @Body() body: DetailProfileBody[]
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    await this.profileService.updateDetailProfile(userId, body);
    return new TsoaSuccessResponse('상세 프로필 수정 성공');
  }

  // /**
  //  * 본인의 상세 프로필을 조회한다
  //  *
  //  * @summary 본인 상세 프로필 조회
  //  */
  // @Get('/detail')
  // @Security('jwt_token')
  // @SuccessResponse(200, '상세 프로필 조회 성공')
  // public async getDetailProfile(
  //   @Request() req: Express.Request
  // ): Promise<ITsoaSuccessResponse<DetailProfileBody[]>> {
  //   const userId = req.user.index;
  //   const data = await this.profileService.getDetailProfile(userId);
  //   return new TsoaSuccessResponse(data);
  // }

  /**
   * 본인의 프로필을 수정한다
   * 이름, 아이디, 소개글, 프로필사진을 수정한다. req.body는 수정하지 않는값이어도 빈칸으로 넘긴다. 이때 공백값이 들아온다면 공백값으로 수정된다.
   *
   * @summary 본인 프로필 수정
   * @param id 아이디
   * @param name 이름
   * @param introduce 소개글
   * @param img 프로필사진
   *
   */
  @Patch('/')
  @Security('jwt_token')
  @SuccessResponse(200, '프로필 수정 성공')
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
   * 유저의 프로필을 조회한다
   * 조회하려는 유저의 아이디를 검색한다,
   * 쓰레드수, 팔로잉, 팔로워, 유저정보, 관심키워드를 반환한다
   *
   * @summary 유저 프로필 조회
   * @param id 아이디
   */
  @Get('/search')
  @SuccessResponse(200, '조회성공')
  @Security('jwt_token')
  @Response<ITsoaErrorResponse>(404, '유저 아이디 조회 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '유저 아이디를 찾을 수 없습니다.',
      data: '유저 아이디를 찾을 수 없습니다.'
    },
    success: null
  })
  public async getProfile(
    @Request() req: Express.Request,
    @Query() id: string
  ): Promise<ITsoaSuccessResponse<ProfileDTO>> {
    const userId = req.user.index;
    const data = await this.profileService.getProfile(id);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 특정 유저의 게시글을 조회한다
   *
   * @summary 유저 게시글 조회
   * @param id 아이디
   */
  @Get('/thread/search')
  @Security('jwt_token')
  @SuccessResponse(200, '게시글 조회 성공')
  @Response<ITsoaErrorResponse>(404, '유저 아이디 조회 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '유저 아이디를 찾을 수 없습니다.',
      data: '유저 아이디를 찾을 수 없습니다.'
    },
    success: null
  })
  public async getThread(
    @Request() req: Express.Request,
    @Query() id: string
  ): Promise<ITsoaSuccessResponse<ResponseFromThreadMainToClient[]>> {
    const userId = req.user.index;
    const data = await this.profileService.getThread(id, userId);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 유저의 아이디를 조회한다 userID를 기반으로 ID를 조회한다
   * eg) userID : 66 -> ID : "seoki"
   *
   * @summary 유저 아이디 조회
   * @param body 유저 아이디
   */
  @Post('/id')
  @Security('jwt_token')
  @SuccessResponse(200, '유저 아이디 조회 성공')
  @Response<ITsoaErrorResponse>(404, '유저 아이디 조회 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '유저 아이디를 찾을 수 없습니다.',
      data: '유저 아이디를 찾을 수 없습니다.'
    },
    success: null
  })
  public async getUserId(
    @Request() req: Express.Request,
    @Body() body: { userId: number }
  ): Promise<ITsoaSuccessResponse<{ id: string }>> {
    const data = await this.profileService.getUserId(body.userId);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 유저의 시간표를 업로드한다.
   *
   * @param timeLine - 시간표 데이터
   * @returns 업로드 성공
   */
  // @Post('/postTimeLine')
  // @Security('jwt_token')
  // @SuccessResponse(200, '시간표 업로드 성공')
  // @Response<ITsoaErrorResponse>(409, '시간표 업로드 실패', {
  //   resultType: 'FAIL',
  //   error: {
  //     errorCode: 'PR-04',
  //     reason: '이미 시간표가 존재합니다.',
  //     data: null
  //   },
  //   success: null
  // })
  // public async postTimeLine(
  //   @Request() req: Express.Request,
  //   @Query() timeLine: string
  // ): Promise<ITsoaSuccessResponse<string>> {
  //   if (!req.user || !req.user.index) {
  //     throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
  //   }

  //   const result = await this.profileService.postTimeLineService(
  //     req.user.index,
  //     timeLine
  //   );

  //   return new TsoaSuccessResponse<string>(result);
  // }

  /**
   * 유저의 시간표를 조회한다.
   *
   * @param userId - 조회할 유저의 ID
   * @summary 유저 시간표 조회
   * @description userId 없이 요청되면 본인의 시간표 조회.
   * @returns 시간표 문자열
   */
  @Get('/getTimeLine')
  @Security('jwt_token')
  @SuccessResponse(200, '시간표 조회 성공')
  @Response<ITsoaErrorResponse>(404, '시간표 조회 실패', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PR-03',
      reason: '시간표가 존재하지 않습니다.',
      data: null
    },
    success: null
  })
  public async getTimeLine(
    @Request() req: Express.Request,
    @Query() userId?: number
  ): Promise<ITsoaSuccessResponse<string>> {
    if (!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    let requestId: number;
    if (userId === undefined) {
      requestId = req.user.index;
    } else {
      requestId = userId;
    }

    const result = await this.profileService.getTimeLineService(requestId);

    return new TsoaSuccessResponse<string>(result);
  }

  /**
   * 유저의 시간표를 수정한다.
   *
   * @param timeLine - 수정할 시간표 정보
   * @returns 수정 결과
   * @summary 유저 시간표 수정
   */
  @Patch('/fixTimeLine')
  @Security('jwt_token')
  @SuccessResponse(200, '시간표 수정 성공')
  @Response<ITsoaErrorResponse>('500', '시간표 수정에 실패했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PR-03',
      reason: '시간표 수정에 실패했습니다.',
      data: null
    },
    success: null
  })
  public async fixTimeLine(
    @Request() req: Express.Request,
    @Query() timeLine: string
  ): Promise<ITsoaSuccessResponse<string>> {
    if (!req.user || !req.user.index) {
      throw new UserUnauthorizedError('유저 인증 정보가 없습니다.');
    }

    const result = await this.profileService.fixTimeLineService(
      req.user.index,
      timeLine
    );

    return new TsoaSuccessResponse<string>(result);
  }

  /**
   * 내가 저장해놓은 쓰레드를 확인한다. 쓰레드 조회 api와 자료형이 똑같습니다
   *
   * @summary 저장해놓은 쓰레드 조회
   */
  @Get('/scrap')
  @Security('jwt_token')
  @SuccessResponse(200, '스크랩 조회 성공')
  public async getScrap(
    @Request() req: Express.Request
  ): Promise<ITsoaSuccessResponse<ResponseFromThreadMainToClient[]>> {
    const userId = req.user.index;
    const data = await this.profileService.getScrap(userId);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 유저를 검색한다.
   *
   * @summary 유저 검색
   * @param id 아이디
   */
  @Post('/search')
  @Security('jwt_token')
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
    @Query() id: string
  ): Promise<ITsoaSuccessResponse<SearchUserDTO[]>> {
    const data = await this.profileService.search(id);
    return new TsoaSuccessResponse(data);
  }

  /**
   * 내가 해당 유저와 커피챗을 한 적이 있는지 여부를 확인한다
   *
   * 상대방 userId를 쿼리에 담아 전송한다.
   *
   * isCoffeechat 은 해당 유저와 커피챗 제안을 주고 받은적이 있는지
   *
   * check은 커피쳇 제안을 확인 한 적이 있는지를 확인할 수 있다.
   *
   * @summary 커피챗 여부 조회
   * @param otherUserId 상대방 userId
   */
  @Get('/isCoffeeChat')
  @Security('jwt_token')
  @SuccessResponse(200, '커피챗 조회 성공')
  public async isCoffeeChat(
    @Request() req: Express.Request,
    @Query() otherUserId: number
  ): Promise<ITsoaSuccessResponse<IsCoffeeChatDTO>> {
    const userId = req.user.index;
    const data = await this.profileService.isCoffeeChat(userId, otherUserId);
    return new TsoaSuccessResponse(data);
  }
}
