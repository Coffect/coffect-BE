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
  Example,
  UploadedFiles
} from 'tsoa';

import { Request as ExpressRequest } from 'express';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ChatService } from './chat.Service';
import {
  ChatDataDTO,
  ChatRoomInfoDTO,
  ChatRoomsDTO
} from '../middleware/chat.DTO/chat.DTO';
import { ChatRoomNotFound } from './chat.Message';

@Route('chat')
@Tags('Chat Controller')
export class ChatController extends Controller {
  private chatService: ChatService;
  constructor() {
    super();
    this.chatService = new ChatService();
  }

  /**
   * 채팅방을 생성한다. 만약 이미 채팅방이 존재한다면 해당 chatRoomId를 반환한다.
   * @summary 채팅방 생성
   */
  @Post('/start')
  @Security('jwt_token')
  @SuccessResponse(200, '채팅방 생성 성공')
  @Response<ITsoaErrorResponse>(409, '이미 채팅방이 존재합니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC409',
      reason: '이미 채팅방이 존재합니다.',
      data: 'chatRoomId'
    },
    success: null
  })
  public async makeChatRoom(
    @Request() req: ExpressRequest,
    @Body()
    body: {
      userId: number;
    }
  ): Promise<ITsoaSuccessResponse<{ chatRoomId: string }>> {
    const myId = req.user.index;
    const otherId = body.userId;
    const chatRoomId = await this.chatService.makeChatRoom(myId, otherId);
    return new TsoaSuccessResponse<{ chatRoomId: string }>(chatRoomId);
  }

  // /**
  //  * 채팅방의 메시지를 조회한다.
  //  * @summary 채팅방 메시지 조회
  //  */
  // @Get('/:chatRoomId/messages')
  // @Security('jwt_token')
  // public async getMessages(
  //   @Request() req: ExpressRequest,
  //   @Query() chatRoomId: string
  // ): Promise<ITsoaSuccessResponse<string[]>> {
  //   const userId = req.user.index;
  //   const result = await this.chatService.getMessages(userId, chatRoomId);
  //   return new TsoaSuccessResponse<string[]>(result);
  // }

  /**
   * 유저가 속해있는 모든 채팅방 목록을 조회한다.
   * 해당 chatRoomId, 상대방 유저의 userId, 마지막으로 보낸 메시지의 lastReadMessageId를 반환한다.
   * @summary 채팅방 목록 조회
   */
  @Get('/rooms')
  @Security('jwt_token')
  @SuccessResponse(200, '채팅방 목록 조회 성공')
  @Response<ITsoaErrorResponse>(500, '서버 오류가 발생했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC500',
      reason: '서버 오류가 발생했습니다.',
      data: '서버 오류가 발생했습니다.'
    },
    success: null
  })
  public async getChatRoom(
    @Request() req: ExpressRequest
  ): Promise<ITsoaSuccessResponse<ChatRoomInfoDTO[]>> {
    const userId = req.user.index;
    const result = await this.chatService.getChatRoom(userId);
    return new TsoaSuccessResponse<ChatRoomInfoDTO[]>(result);
  }

  /**
   * 채팅방에 메시지를 전송한다.
   * chatRoomId를 기반으로 message를 받아 전송한다.
   * @summary 채팅방 메시지 전송
   */
  @Post('/message')
  @Security('jwt_token')
  @SuccessResponse(200, '메시지 전송 성공')
  public async sendMessage(
    @Query() chatRoomId: string,
    @Request() req: ExpressRequest,
    @Body() body: { message: string }
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    const result = await this.chatService.sendMessage(
      userId,
      chatRoomId,
      body.message
    );
    return new TsoaSuccessResponse<string>('메시지 전송 성공');
  }

  /**
   * 채팅방의 메시지를 조회한다.
   * 특정 chatRoomId에 있는 메시지를 조회한다.
   * @summary 채팅방 메시지 조회
   */
  @Get('/')
  @Security('jwt_token')
  @SuccessResponse(200, '채팅방 정보 조회 성공')
  @Response<ITsoaErrorResponse>(404, '채팅방을 찾을 수 없습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC404',
      reason: '채팅방을 찾을 수 없습니다.',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(500, '서버 오류가 발생했습니다.', {
    resultType: 'FAIL',
    error: {
      errorCode: 'EC500',
      reason: '서버 오류가 발생했습니다.',
      data: null
    },
    success: null
  })
  public async getChatRoomInfo(
    @Request() req: ExpressRequest,
    @Query() chatRoomId: string
  ): Promise<ITsoaSuccessResponse<ChatDataDTO[]>> {
    if (!chatRoomId) {
      throw new ChatRoomNotFound('채팅방을 찾을 수 없습니다.');
    }

    const result = await this.chatService.getChatRoomInfo(chatRoomId);
    return new TsoaSuccessResponse<ChatDataDTO[]>(result);
  }

  /**
   * 채팅방의 메시지를 읽음 처리한다.
   * 특정 chatRoomId에 있는 메시지를 읽음 처리한다.
   *
   * @param chatRoomId 읽음 처리할 채팅방의 ID
   * @param req Express 요청 객체
   * @return 읽음 처리 성공 메시지
   * @summary 채팅방 메시지 읽음 처리
   */
  @Patch('/read')
  @Security('jwt_token')
  @SuccessResponse(200, '메시지 읽음 처리 성공')
  public async readMessage(
    @Query() chatRoomId: string,
    @Request() req: ExpressRequest
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user.index;
    await this.chatService.readMessage(chatRoomId, userId);
    return new TsoaSuccessResponse<string>('메시지 읽음 처리 성공');
  }

  /**
   * 메시지 사진 보내기
   *
   * @param chatRoomId 보낼 채팅방 ID
   * @param req Express 요청 객체
   * @return 사진 전달
   * @summary 메시지 사진 전송
   */
  @Post('/photo')
  @Security('jwt_token')
  @SuccessResponse(200, '사진 전송 성공')
  @Response<ITsoaErrorResponse>(400, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'HE400',
      reason: '사진을 올리는 중 오류가 발생했습니다',
      data: null
    },
    success: null
  })
  @Response<ITsoaErrorResponse>(500, 'Internal Server Error', {
    resultType: 'FAIL',
    error: {
      errorCode: 'HE500',
      reason: '서버 오류가 발생했습니다.',
      data: null
    },
    success: null
  })
  public async sendPhoto(
    @Request() req: ExpressRequest,
    @Query() chatRoomId: string,
    @UploadedFiles('image') image: Express.Multer.File[]
  ): Promise<ITsoaSuccessResponse<ChatDataDTO>> {
    const userId = req.user.index;
    const imageUrl = await this.chatService.uploadPhoto(image[0]);

    const result = await this.chatService.sendPhoto(
      userId,
      chatRoomId,
      imageUrl
    );

    return new TsoaSuccessResponse<ChatDataDTO>(result);
  }

  /**
   * 메시지 사진 보내기
   *
   * @param chatRoomId 채팅방 ID
   * @param req Express 요청 객체
   * @return coffectId
   * @summary 커피챗 제안 아이디 전송
   */
  @Get('getCoffectId')
  @Security('jwt_token')
  @SuccessResponse(200, '커피 아이디 조회 성공')
  public async getCoffectId(
    @Request() req: ExpressRequest,
    @Query() chatRoomId: string
  ): Promise<ITsoaSuccessResponse<number>> {
    const userId = req.user.index;
    const result = await this.chatService.getCoffectIdToSuggest(
      userId,
      chatRoomId
    );
    return new TsoaSuccessResponse<number>(result);
  }
}
