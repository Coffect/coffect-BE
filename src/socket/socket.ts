import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import SocketService from './socket.service';
import { ChatService } from '../chat/chat.Service';

export default function initSocket(io: Server) {
  const socketService = new SocketService();
  const chatService = new ChatService();
  //socket.io 관리자 페이지 설정
  instrument(io, {
    auth: false,
    mode: 'development'
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.decoded.index;
    const userName = socket.data.decoded.name;
    console.log(`${userId} connected`);
    await socketService.joinRoom(socket);

    socket.on('send', async ({ message, roomId }) => {
      //클라이언트가 roomID를 같이 보내주면 해당 방에 메시지를 보낸다 애초에 클라이언트는 해당 방의 정보를 미리 알고 있어야함
      await chatService.sendMessage(userId, roomId, message);
      //굳이 상대방이 있나 없나 체크할 필요가 없어보임,,
      io.to(roomId).emit('receive', {
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
