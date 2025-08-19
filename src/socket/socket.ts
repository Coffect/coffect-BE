import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import SocketService from './socket.service';
import { ChatService } from '../chat/chat.Service';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '../middleware/socket.DTO/socket.DTO';
import verifySocket from '../middleware/verifySocket';
import { SocketConnectionError } from './socket.message';
import { KSTtime } from '../config/KSTtime';

export default function initSocket(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  const socketService = new SocketService();
  const chatService = new ChatService();

  //socket.io 관리자 페이지 설정
  instrument(io, {
    auth: false,
    mode: 'development'
  });

  io.use(verifySocket);
  io.on('error', (err: any) => {
    console.log('Socket.io 서버 오류:', err);
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.decoded.index;
    const userName = socket.data.decoded.userName;

    console.log(
      `==============\nsocket.io established\nuserId: ${userId}\nuserName: ${userName}`
    );

    try {
      await socketService.joinRoom(socket);
    } catch (err: any) {
      console.error('소켓 룸 참가 오류:', err);
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      socket.emit('errorAck', {
        error: 'EC500',
        message: '소켓 연결 중 오류가 발생했습니다.',
        description: errorMessage
      });
      socket.disconnect();
      return;
    }

    socket.on('send', async ({ message, chatRoomId }) => {
      try {
        // MongoDB 연결 상태 확인
        await chatService.sendMessage(userId, chatRoomId, message);

        // 메시지 전송 성공 시 브로드캐스트
        io.to(chatRoomId).emit('receive', {
          sender: userId,
          senderName: userName,
          message: message,
          timestamp: KSTtime().toISOString()
        });
      } catch (err: any) {
        console.error('메시지 전송 오류:', err);

        // MongoDB 연결 오류인지 확인
        const isMongoError =
          err.code === 'P2010' ||
          err.message?.includes('Connection refused') ||
          err.message?.includes('Transactions are not supported');

        const errorMessage = isMongoError
          ? '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          : '메시지 전송 중 오류가 발생했습니다.';

        socket.emit('errorAck', {
          error: 'EC500',
          message: errorMessage,
          description: err.message || '알 수 없는 오류'
        });

        // MongoDB 연결 오류가 아닌 경우에만 연결 해제
        if (!isMongoError) {
          socket.disconnect();
        }
      }
    });

    // 타이핑 상태 전송
    socket.on('typing', ({ chatRoomId, isTyping }) => {
      socket.to(chatRoomId).emit('userTyping', {
        userId: userId,
        userName: userName,
        isTyping: isTyping
      });
    });

    // 메시지 읽음 상태 전송
    socket.on('seen', ({ chatRoomId, messageId }) => {
      socket.to(chatRoomId).emit('messageSeen', {
        userId: userId,
        userName: userName,
        messageId: messageId
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`사용자 ${userName} (${userId}) 연결 해제: ${reason}`);
    });
  });

  io.engine.on('connection_error', (err) => {
    console.error('Socket.io 엔진 연결 오류:', {
      req: err.req,
      code: err.code,
      message: err.message,
      context: err.context
    });
  });
}
