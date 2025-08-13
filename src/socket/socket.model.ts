import { prisma } from '../config/prisma.config';
import { SocketConnectionError } from './socket.message';

export class SocketModel {
  public async getRooms(userId: number): Promise<string[]> {
    try {
      const data = await prisma.chatRoomUser.findMany({
        where: { userId: userId },
        select: { chatroomId: true }
      });
      
      if (data.length === 0) {
        console.log(`사용자 ${userId}의 채팅방이 없습니다.`);
        return [];
      }
      
      const rooms = data.map((item) => item.chatroomId);
      console.log(`사용자 ${userId}의 채팅방 조회 성공: ${rooms.length}개`);
      return rooms;
      
    } catch (err: any) {
      console.error('채팅방 조회 중 오류:', err);
      
      // MongoDB 연결 오류인지 확인
      const isMongoError = err.code === 'P2010' || 
                         err.message?.includes('Connection refused') ||
                         err.message?.includes('Server selection timeout') ||
                         err.message?.includes('Transactions are not supported');
      
      if (isMongoError) {
        throw new SocketConnectionError(
          `데이터베이스 연결 오류: ${err.message || 'MongoDB 연결에 실패했습니다.'}`
        );
      }
      
      throw new SocketConnectionError(
        `채팅방 조회 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`
      );
    }
  }
}