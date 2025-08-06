import { KSTtime } from '../config/KSTtime';
import { prisma } from '../config/prisma.config';

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

  public async getChatRoom(userId: number): Promise<string[]> {
    const result = await prisma.chatRoomUser.findMany({
      where: { userId: userId },
      select: { chatroomId: true }
    });
    return result.map((chatroomId) => chatroomId.chatroomId);
  }
}
