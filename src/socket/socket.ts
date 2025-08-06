import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import SocketService from './socket.service';

export default function initSocket(io: Server) {
  const socketService = new SocketService();
  //socket.io 관리자 페이지 설정
  instrument(io, {
    auth: false,
    mode: 'development'
  });

  io.on('connection', async (socket) => {
    console.log(`${socket.data.decoded.index} connected`);
    await socketService.joinRoom(socket);

    socket.on('send', ({ message, roomId }) => {
      //클라이언트가 roomID를 같이 보내주면 해당 방에 메시지를 보낸다 애초에 클라이언트는 해당 방의 정보를 미리 알고 있어야함
      console.log(message, ' from ', socket.id);
      socket.to(roomId).emit('receive', {
        //roomID를 먼저 만들고, 클라이언트에서 roomId를 생성해서 메세지 보내기
        timeStampe: new Date().toISOString(),
        sender: socket.id
      });
    });

    // socket.on("typing",())
    // socket.on("seen",())

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });
  });
}
