import { Body, Controller, Get, Post, Route, SuccessResponse, Tags, Response, Request, Middlewares, Query, Patch, Security } from 'tsoa';
import { ITsoaErrorResponse, ITsoaSuccessResponse, TsoaSuccessResponse } from '../config/tsoaResponse';
import { Request as ExpressRequest } from 'express';
import { AlertService } from './alert.Service';
import { FCMService } from '../config/fcm';

@Route('alert') 
@Tags('Alert Controller')
export class AlertController extends Controller {
  private alertService: AlertService;

  constructor() {
    super();
    this.alertService = new AlertService();
  }

  /**
   * FCM 토큰 등록 API
   * 
   * @summary 사용자의 FCM 토큰을 등록/업데이트하는 API
   * @param body FCM 토큰
   * @returns 요청 성공 여부
   * 
   * 프론트엔드에서 받는 응답:
   * 성공 시: { resultType: "SUCCESS", error: null, success: "FCM 토큰이 성공적으로 등록되었습니다." }
   * 실패 시: { resultType: "FAIL", error: { errorCode: "AL500", reason: "서버 오류가 발생했습니다.", data: null }, success: null }
   */
  @Post('registerFCMToken')
  @Security('jwt_token')
  @SuccessResponse('200', 'FCM 토큰이 성공적으로 등록되었습니다.')
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async registerFCMTokenController(
    @Request() req: ExpressRequest,
    @Body() body: { 
      fcmToken: string;
    },
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    const { fcmToken } = body;

    console.log(`FCM 토큰 등록 요청: 사용자 ${userId}, 토큰: ${fcmToken ? fcmToken.substring(0, 20) + '...' : 'null'}`);

    if (!fcmToken) {
      console.error('FCM 토큰이 제공되지 않음');
      throw new Error('FCM 토큰이 필요합니다.');
    }

    const result = await FCMService.saveUserFCMToken(userId, fcmToken);
    
    if (result) {
      console.log(`FCM 토큰 등록 성공: 사용자 ${userId}`);
      return new TsoaSuccessResponse<string>('FCM 토큰이 성공적으로 등록되었습니다.');
    } else {
      console.error(`FCM 토큰 등록 실패: 사용자 ${userId}`);
      throw new Error('FCM 토큰 등록에 실패했습니다.');
    }
  }

  /**
   * 알림 목록 조회 API
   * 
   * @summary 사용자의 알림 목록을 조회하는 API
   * @returns 알림 목록
   * 
   * 프론트엔드에서 받는 응답:
   * 성공 시: { resultType: "SUCCESS", error: null, success: [알림 목록 배열] }
   * 실패 시: { resultType: "FAIL", error: { errorCode: "AL500", reason: "서버 오류가 발생했습니다.", data: null }, success: null }
   * 
   * 알림 목록 각 항목 구조:
   * - notificationId: 알림 ID
   * - userId: 사용자 ID
   * - type: 알림 타입 (예: "coffee_chat_proposal")
   * - title: 알림 제목
   * - body: 알림 내용
   * - data: 추가 데이터 (JSON 형태)
   * - isRead: 읽음 여부
   * - createdAt: 생성 시간
   */
  @Get('getNotifications')
  @Security('jwt_token')
  @SuccessResponse('200', '알림 목록을 성공적으로 조회했습니다.')
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async getNotificationsController(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<any>> {
    const userId = req.user.index;

    const notifications = await this.alertService.getNotificationsService(userId);

    return new TsoaSuccessResponse<any>(notifications);
  }

  /**
   * 알림 읽음 처리 API
   * 
   * @summary 특정 알림을 읽음 처리하는 API
   * @param body 알림 ID
   * @returns 요청 성공 여부
   */
  @Patch('markAsRead')
  @Security('jwt_token')
  @SuccessResponse('200', '알림이 성공적으로 읽음 처리되었습니다.')
  @Response<ITsoaErrorResponse>(
    400,
    'Bad Request',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL400',
        reason: '잘못된 요청입니다.',
        data: null
      },
      success: null
    })
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async markAsReadController(
    @Request() req: ExpressRequest,
    @Body() body: { 
      notificationId: number;
    },
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    const { notificationId } = body;

    await this.alertService.markAsReadService(userId, notificationId);

    return new TsoaSuccessResponse<string>('알림이 성공적으로 읽음 처리되었습니다.');
  }

  /**
   * 모든 알림 읽음 처리 API
   * 
   * @summary 사용자의 모든 알림을 읽음 처리하는 API
   * @returns 요청 성공 여부
   */
  @Patch('markAllAsRead')
  @Security('jwt_token')
  @SuccessResponse('200', '모든 알림이 성공적으로 읽음 처리되었습니다.')
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async markAllAsReadController(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;

    await this.alertService.markAllAsReadService(userId);

    return new TsoaSuccessResponse<string>('모든 알림이 성공적으로 읽음 처리되었습니다.');
  }

  /**
   * 읽지 않은 알림 개수 조회 API
   * 
   * @summary 사용자의 읽지 않은 알림 개수를 조회하는 API
   * @returns 읽지 않은 알림 개수
   * 
   * 프론트엔드에서 받는 응답:
   * 성공 시: { resultType: "SUCCESS", error: null, success: 숫자 }
   * 실패 시: { resultType: "FAIL", error: { errorCode: "AL500", reason: "서버 오류가 발생했습니다.", data: null }, success: null }
   * 
   * 예시: { resultType: "SUCCESS", error: null, success: 5 }
   */
  @Get('getUnreadCount')
  @Security('jwt_token')
  @SuccessResponse('200', '읽지 않은 알림 개수를 성공적으로 조회했습니다.')
  @Response<ITsoaErrorResponse>(
    500,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'AL500',
        reason: '서버 오류가 발생했습니다.',
        data: null
      },
      success: null
    })
  public async getUnreadCountController(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<number>> {
    const userId = req.user.index;

    const count = await this.alertService.getUnreadCountService(userId);

    return new TsoaSuccessResponse<number>(count);
  }
}
