import { KSTtime, KSTtimeToISOString } from '../config/KSTtime';
import { mongo, prisma } from '../config/prisma.config';
import { uploadToS3 } from '../config/s3';
import { ChatDataDTO, ChatRoomsDTO } from '../middleware/chat.DTO/chat.DTO';

export class ChatModel {
  private toISOStringOrString(value: unknown): string {
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    try {
      // Prisma Mongo 클라이언트가 Date 유사 객체를 줄 수도 있어 new Date 처리
      const d = new Date(value as any);
      return isNaN(d.getTime()) ? String(value) : d.toISOString();
    } catch {
      return String(value);
    }
  }
  public async makeChatRoom(
    myId: number,
    otherId: number,
    chatRoomId: string,
    coffectId: number
  ): Promise<void> {
    try {
      const makeRoom = prisma.chatRoom.create({
        data: {
          chatroomId: chatRoomId,
          coffectId: coffectId,
          createdTime: KSTtime()
        }
      });
      const insertUser1 = prisma.chatRoomUser.create({
        data: { userId: myId, chatroomId: chatRoomId }
      });
      const insertUser2 = prisma.chatRoomUser.create({
        data: { userId: otherId, chatroomId: chatRoomId }
      });
      await prisma.$transaction([makeRoom, insertUser1, insertUser2]);
    } catch (error) {
      console.error('채팅방 생성 중 오류 발생:', error);
      throw new Error('채팅방을 생성하는 중 오류가 발생했습니다.');
    }
  }

  public async getChatRoom(userId: number): Promise<ChatRoomsDTO[]> {
    try {
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
    } catch (error) {
      console.error('채팅방 목록 조회 중 오류 발생:', error);
      throw new Error('채팅방 목록을 조회하는 중 오류가 발생했습니다.');
    }
  }

  public async checkUserInChatRoom(
    userId: number,
    chatRoomId: string
  ): Promise<boolean> {
    try {
      const result = await prisma.chatRoomUser.findFirst({
        where: {
          userId: userId,
          chatroomId: chatRoomId
        }
      });
      return !!result;
    } catch (error) {
      console.error('사용자 채팅방 접근 권한 확인 중 오류 발생:', error);
      throw new Error('사용자 접근 권한을 확인하는 중 오류가 발생했습니다.');
    }
  }

  public async sendMessage(
    userId: number,
    chatRoomId: string,
    message: string,
    isPhoto?: boolean | false
  ): Promise<ChatDataDTO> {
    try {
      const data = await mongo.message.create({
        data: {
          userId,
          chatRoomId: chatRoomId,
          messageBody: message,
          createdAt: KSTtimeToISOString(),
          isPhoto: isPhoto,
          check: false
        }
      });
      // DTO 매핑: createdAt을 문자열(ISO)로 유지
      return {
        id: data.id,
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        messageBody: data.messageBody,
        createdAt: this.toISOStringOrString(data.createdAt as unknown),
        isPhoto: data.isPhoto,
        check: data.check
      };
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
      throw new Error('메시지를 전송하는 중 오류가 발생했습니다.');
    }
  }

  public async getLastMessageByChatRoomId(
    chatRoomId: string
  ): Promise<ChatDataDTO | null> {
    const result = await mongo.message.findFirst({
      where: { chatRoomId: chatRoomId },
      orderBy: { createdAt: 'desc' }
    });
    if (!result) {
      return null;
    }
    return {
      id: result.id,
      chatRoomId: result.chatRoomId,
      userId: result.userId,
      messageBody: result.messageBody,
      createdAt: this.toISOStringOrString(result.createdAt as unknown),
      isPhoto: result.isPhoto,
      check: result.check
    };
  }

  public async getChatRoomInfo(chatRoomId: string): Promise<ChatDataDTO[]> {
    try {
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
      return result.map((row) => ({
        id: row.id,
        chatRoomId: row.chatRoomId,
        userId: row.userId,
        messageBody: row.messageBody,
        createdAt: this.toISOStringOrString(row.createdAt as unknown),
        isPhoto: row.isPhoto,
        check: row.check
      }));
    } catch (error) {
      console.error('채팅방 메시지 조회 중 오류 발생:', error);
      throw new Error('채팅방 메시지를 조회하는 중 오류가 발생했습니다.');
    }
  }

  public async updateLastSendMessage(chating: ChatDataDTO) {
    try {
      const result = await prisma.chatRoomUser.updateMany({
        where: {
          chatroomId: chating.chatRoomId
        },
        data: { lastMessage: chating.messageBody, check: chating.check }
      });
      return result;
    } catch (error) {
      console.error('마지막 메시지 업데이트 중 오류 발생:', error);
      throw new Error('마지막 메시지를 업데이트하는 중 오류가 발생했습니다.');
    }
  }

  public async readMessage(
    chatRoomId: string,
    userId: number
  ): Promise<boolean> {
    try {
      const result = await mongo.message.updateMany({
        where: {
          chatRoomId: chatRoomId,
          userId: { not: userId },
          check: false
        },
        data: { check: true }
      });
      return result.count > 0; // 읽음 처리된 메시지가 있는지 여부 반환
    } catch (error) {
      console.error('메시지 읽음 처리 중 오류 발생:', error);
      throw new Error('메시지를 읽음 처리하는 중 오류가 발생했습니다.');
    }
  }

  public async uploadPhoto(image: Express.Multer.File): Promise<string> {
    try {
      const imageUrl = await uploadToS3(image);
      return imageUrl;
    } catch (error) {
      console.error('사진 업로드 중 오류 발생:', error);
      throw new Error('사진을 업로드하는 중 오류가 발생했습니다.');
    }
  }

  public async sendPhoto(
    userId: number,
    chatRoomId: string,
    imageUrl: string
  ): Promise<ChatDataDTO> {
    try {
      const data = await mongo.message.create({
        data: {
          userId,
          chatRoomId: chatRoomId,
          messageBody: imageUrl,
          createdAt: KSTtimeToISOString(),
          isPhoto: true,
          check: false
        }
      });
      return {
        id: data.id,
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        messageBody: data.messageBody,
        createdAt: this.toISOStringOrString(data.createdAt as unknown),
        isPhoto: data.isPhoto,
        check: data.check
      };
    } catch (error) {
      console.error('사진 메시지 저장 중 오류 발생:', error);
      throw new Error('사진 메시지를 저장하는 중 오류가 발생했습니다.');
    }
  }

  public async getCoffectId(userId: number, otherId: number): Promise<number> {
    try {
      const coffectId = await prisma.coffeeChat.findFirst({
        where: {
          OR: [
            {
              firstUserId: userId,
              secondUserId: otherId
            },
            {
              firstUserId: otherId,
              secondUserId: userId
            }
          ]
        },
        select: {
          coffectId: true
        }
      });
      if (!coffectId) {
        throw new Error('커피챗 제안 아이디를 찾을 수 없습니다.');
      }
      return coffectId.coffectId;
    } catch (error) {
      console.error('커피챗 제안 아이디 조회 중 오류 발생:', error);
      throw new Error('커피챗 제안 아이디를 조회하는 중 오류가 발생했습니다.');
    }
  }

  public async getCoffectIdToSuggest(
    userId: number,
    chatRoomId: string
  ): Promise<number> {
    try {
      const coffectId = await prisma.chatRoom.findFirst({
        where: {
          chatroomId: chatRoomId
        },
        select: {
          coffectId: true
        }
      });

      if (!coffectId) {
        throw new Error('커피챗 제안 아이디를 찾을 수 없습니다.');
      }

      return coffectId.coffectId;
    } catch (error) {
      console.error('커피챗 제안 아이디 조회 중 오류 발생:', error);
      throw new Error('커피챗 제안 아이디를 조회하는 중 오류가 발생했습니다.');
    }
  }
}
