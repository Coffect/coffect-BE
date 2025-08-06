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

import { Request as ExpressRequest } from 'express';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ChatService } from './chat.Service';
import { ChatRoomsDTO } from '../middleware/chat.DTO/chat.DTO';

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
  ): Promise<ITsoaSuccessResponse<ChatRoomsDTO[]>> {
    const userId = req.user.index;
    const result = await this.chatService.getChatRoom(userId);
    return new TsoaSuccessResponse<ChatRoomsDTO[]>(result);
  }

  @Post('/:chatRoomId/message')
  @Security('jwt_token')
  @SuccessResponse(200, '메시지 전송 성공')
  public async sendMessage(
    @Request() req: ExpressRequest,
    @Query() chatRoomId: string,
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
}
