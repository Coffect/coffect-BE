import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import SocketService from './socket.service';
import { ChatService } from '../chat/chat.Service';
import { SocketConnectionError, SocketMessageError } from './socket.message';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '../middleware/socket.DTO/socket.DTO';

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

  io.on('connection', async (socket) => {
    const userId = socket.data.decoded.index;
    const userName = socket.data.decoded.userName;

    console.log(`socket.io established\n
      userId: ${userId}\n
      userName: ${userName}`);

    await socketService.joinRoom(socket);

    socket.on('send', async ({ message, chatRoomId }) => {
      try {
        await chatService.sendMessage(userId, chatRoomId, message);
      } catch (err: any) {
        console.log(err);
      }
      io.to(chatRoomId).emit('receive', {
        //roomID를 먼저 만들고, 클라이언트에서 roomId를 생성해서 메세지 보내기
        sender: userId,
        senderName: userName,
        message: message
      });
    });

    // socket.on("typing",())
    // socket.on("seen",())

    socket.on('disconnect', () => {});
  });
}
