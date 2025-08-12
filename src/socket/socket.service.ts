import { Server, Socket } from 'socket.io';
import { SocketModel } from './socket.model';

// wrapAsync 패턴을 위한 헬퍼 함수
function wrapAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('SocketService Error:', error);
      throw error; // 상위에서 처리하도록 에러를 다시 던짐
    }
  };
}

export default class SocketService {
  private SocketModel: SocketModel;
  
  constructor() {
    this.SocketModel = new SocketModel();
  }
  
  // wrapAsync 패턴을 적용한 joinRoom 메서드
  public joinRoom = wrapAsync(async (socket: Socket) => {
    const userId = socket.data.decoded.index;
    const rooms = await this.SocketModel.getRooms(userId);
    
    for (const room of rooms) {
      try {
        await socket.join(room);
        console.log(`User ${userId} joined room: ${room}`);
      } catch (joinError) {
        console.error(`Failed to join room ${room}:`, joinError);
        // 개별 룸 조인 실패는 전체 프로세스를 중단시키지 않음
      }
    }
  });
}
