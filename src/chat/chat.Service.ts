import { ChatDataDTO, ChatRoomsDTO } from '../middleware/chat.DTO/chat.DTO';
import { ChatModel } from './chat.Model';
import { pbkdf2Promise } from '../config/crypto';
import { ChatRoomAlreadyExists, ChatRoomNotFound } from './chat.Message';

export class ChatService {
  private chatModel: ChatModel;
  constructor() {
    this.chatModel = new ChatModel();
  }

  public async makeChatRoom(
    myId: number,
    otherId: number
  ): Promise<{ chatRoomId: string }> {
    const usersRooms = await this.chatModel.getChatRoom(myId);
    const chatRoomId = await pbkdf2Promise(
      // 유저 아이디를 조합해 난수 chatRoomId 생성
      myId.toString(),
      otherId.toString(),
      1000,
      32,
      'sha512'
    ).then((result) => result.toString('base64'));
    if (usersRooms.some((room) => room.chatroomId === chatRoomId)) {
      // 이미 존재하는 채팅방이라면 예외 발생
      throw new ChatRoomAlreadyExists(chatRoomId);
    }
    await this.chatModel.makeChatRoom(myId, otherId, chatRoomId);
    return { chatRoomId };
  }

  public async getChatRoom(userId: number): Promise<ChatRoomsDTO[]> {
    const result = await this.chatModel.getChatRoom(userId);
    return result;
  }

  public async sendMessage(
    userId: number,
    chatRoomId: string,
    message: string
  ): Promise<string> {
    const chatRoom = await this.chatModel.getChatRoom(userId);
    if (!chatRoom.some((room) => room.chatroomId === chatRoomId)) {
      // 내 채팅방 목록중에 존재하지 않는경우
      throw new ChatRoomNotFound(chatRoomId);
    }
    const result = await this.chatModel.sendMessage(
      userId,
      chatRoomId,
      message
    );
    await this.chatModel.updateLastSendMessage(result); // 해당 채팅방의 마지막 메시지 업데이트
    return '메시지 전송 성공';
  }

  public async getChatRoomInfo(chatRoomId: string): Promise<ChatDataDTO[]> {
    // 채팅방에 존재하는 메시지들을 배열로 조회
    const result = await this.chatModel.getChatRoomInfo(chatRoomId);
    return result;
  }

  public async readMessage(
    chatRoomId: string,
    userId: number
  ): Promise<string> {
    const result = await this.chatModel.readMessage(chatRoomId, userId);

    if (!result) {
      throw new ChatRoomNotFound(chatRoomId);
    }

    return '채팅 읽기 성공';
  }
}
