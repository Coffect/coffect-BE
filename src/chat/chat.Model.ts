import { KSTtime } from '../config/KSTtime';
import { mongo, prisma } from '../config/prisma.config';
import { uploadToS3 } from '../config/s3';
import { ChatDataDTO, ChatRoomsDTO } from '../middleware/chat.DTO/chat.DTO';

export class ChatModel {
  public async makeChatRoom(
    myId: number,
    otherId: number,
    chatRoomId: string
  ): Promise<void> {
    const makeRoom = prisma.chatRoom.create({
      data: { chatroomId: chatRoomId, createdTime: KSTtime() }
    });
    const insertUser1 = prisma.chatRoomUser.create({
      data: { userId: myId, chatroomId: chatRoomId }
    });
    const insertUser2 = prisma.chatRoomUser.create({
      data: { userId: otherId, chatroomId: chatRoomId }
    });
    await prisma.$transaction([makeRoom, insertUser1, insertUser2]);
  }

  public async getChatRoom(userId: number): Promise<ChatRoomsDTO[]> {
    const result = await prisma.chatRoomUser.findMany({
      where: { userId: userId },
      select: {
        chatroomId: true
      }
    });

    const roomsInfo = await prisma.chatRoomUser.findMany({
      where: {
        userId: { not: userId },
        chatroomId: { in: result.map((chatroomId) => chatroomId.chatroomId) }
      },
      select: {
        chatroomId: true,
        userId: true,
        lastMessage: true,
        check: true
      }
    });
    return roomsInfo;
  }

  public async sendMessage(
    userId: number,
    chatRoomId: string,
    message: string
  ): Promise<ChatDataDTO> {
    const data = await mongo.message.create({
      data: {
        userId,
        chatRoomId: chatRoomId,
        messageBody: message,
        createdAt: KSTtime(),
        isPhoto: false,
        check: false
      }
    });
    return data;
  }

  public async getChatRoomInfo(chatRoomId: string): Promise<ChatDataDTO[]> {
    const result = await mongo.message.findMany({
      where: { chatRoomId: chatRoomId },
      select: {
        id: true,
        chatRoomId: true,
        userId: true,
        messageBody: true,
        createdAt: true,
        isPhoto: true,
        check: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return result;
  }

  public async updateLastSendMessage(chating: ChatDataDTO) {
    const result = await prisma.chatRoomUser.updateMany({
      where: {
        chatroomId: chating.chatRoomId
      },
      data: { lastMessage: chating.messageBody, check: chating.check }
    });
    return result;
  }

  public async readMessage(
    chatRoomId: string,
    userId: number
  ): Promise<boolean> {
    const result = await mongo.message.updateMany({
      where: {
        chatRoomId: chatRoomId,
        userId: { not: userId },
        check: false
      },
      data: { check: true }
    });
    return result.count > 0; // 읽음 처리된 메시지가 있는지 여부 반환
  }

  
  public async uploadPhoto(
    image: Express.Multer.File
  ):Promise<string> {
    const imageUrl = await uploadToS3(image);
    return imageUrl;
  };


  public async sendPhoto(
    userId: number,
    chatRoomId: string,
    imageUrl: string
  ): Promise<ChatDataDTO> {
    try {
      const data = await mongo.message.create({
        data: {
          userId,
          chatRoomId,
          messageBody: imageUrl,
          createdAt: KSTtime(),
          isPhoto: true,
          check: false
        }
      });
      return data;
    } catch (error) {
      console.error('MongoDB create error:', error);
      throw new Error('사진 메시지 저장 중 오류가 발생했습니다.');
    }
  }
}
