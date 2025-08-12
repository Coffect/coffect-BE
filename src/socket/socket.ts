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
    console.log(err);
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.decoded.index;
    const userName = socket.data.decoded.userName;

    console.log(
      `==============\nsocket.io established\nuserId: ${userId}\nuserName: ${userName}`
    );
    try {
      await socketService.joinRoom(socket);
    } catch (err) {
      socket.emit('errorAck', err);
      socket.disconnect();
    }

    socket.on('send', async ({ message, chatRoomId }) => {
      try {
        await chatService.sendMessage(userId, chatRoomId, message);
      } catch (err: any) {
        socket.emit('errorAck', err);
        socket.disconnect();
      }
      io.to(chatRoomId).emit('receive', {
        sender: userId,
        senderName: userName,
        message: message
      });
    });

    // socket.on("typing",())
    // socket.on("seen",())

    socket.on('disconnect', () => {});
  });
  io.engine.on('connection_error', (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });
}
