import { KSTtime } from '../config/KSTtime';
import { prisma } from '../config/prisma.config';
import { ChatRoomsDTO } from '../middleware/chat.DTO/chat.DTO';

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
        lastReadMessageId: true
      }
    });

    return roomsInfo;
  }
}
