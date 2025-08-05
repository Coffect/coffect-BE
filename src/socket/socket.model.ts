import { prisma } from '../config/prisma.config';

export class SocketModel {
  public async getRooms(userId: number): Promise<{}[]> {
    const data = await prisma.chatJoin.findMany({
      where: { userId: userId },
      select: { chatRoomId: true }
    });
    if (data.length === 0) {
      return [];
    }
    return data.map((item) => item.chatRoomId);
  }
}
