import { Server, Socket } from 'socket.io';
import { SocketModel } from './socket.model';
import { SocketConnectionError } from './socket.message';

export default class SocketService {
  private SocketModel: SocketModel;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1초

  constructor() {
    this.SocketModel = new SocketModel();
  }

  public async joinRoom(socket: Socket) {
    const userId = socket.data.decoded.index;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const rooms = await this.SocketModel.getRooms(userId);
        
        for (const room of rooms) {
          await socket.join(room);
          console.log(`사용자 ${userId}가 채팅방 ${room}에 참가했습니다.`);
        }
        
        console.log(`사용자 ${userId}가 ${rooms.length}개의 채팅방에 성공적으로 참가했습니다.`);
        return;
        
      } catch (err: any) {
        console.error(`채팅방 참가 시도 ${attempt}/${this.maxRetries} 실패:`, err);
        
        // MongoDB 연결 오류인지 확인
        const isMongoError = err.code === 'P2010' || 
                           err.message?.includes('Connection refused') ||
                           err.message?.includes('Server selection timeout');
        
        if (isMongoError && attempt < this.maxRetries) {
          console.log(`${this.retryDelay}ms 후 재시도합니다...`);
          await this.delay(this.retryDelay);
          this.retryDelay *= 2; // 지수 백오프
          continue;
        }
        
        // 마지막 시도이거나 MongoDB 오류가 아닌 경우
        throw new SocketConnectionError(
          `채팅방 참가 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`
        );
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}