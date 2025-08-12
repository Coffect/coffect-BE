import { prisma } from '../config/prisma.config';

// wrapAsync 패턴을 위한 헬퍼 함수
function wrapAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('SocketModel Error:', error);
      throw error; // 상위에서 처리하도록 에러를 다시 던짐
    }
  };
}

export class SocketModel {
  // wrapAsync 패턴을 적용한 getRooms 메서드
  public getRooms = wrapAsync(async (userId: number): Promise<string[]> => {
    const data = await prisma.chatRoomUser.findMany({
      where: { userId: userId },
      select: { chatroomId: true }
    });
    
    if (data.length === 0) {
      return [];
    }
    
    return data.map((item) => item.chatroomId);
  });
}
