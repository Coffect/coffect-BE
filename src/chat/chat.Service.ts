import { ChatRoomDTO } from '../middleware/chat.DTO/chat.DTO';
import { ChatModel } from './chat.Model';
import { pbkdf2Promise } from '../config/crypto';
import { ChatRoomAlreadyExists } from './chat.Message';

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
      myId.toString(),
      otherId.toString(),
      1000,
      32,
      'sha512'
    ).then((result) => result.toString('base64'));
    if (usersRooms.includes(chatRoomId)) {
      throw new ChatRoomAlreadyExists(chatRoomId);
    }
    await this.chatModel.makeChatRoom(myId, otherId, chatRoomId);
    return { chatRoomId };
  }

  public async getChatRoom(userId: number): Promise<string[]> {
    const result = await this.chatModel.getChatRoom(userId);
    return result;
  }
}
