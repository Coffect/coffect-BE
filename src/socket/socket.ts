import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import SocketService from './socket.service';

const roomDumy = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function initSocket(io: Server) {
  const socketService = new SocketService();
  //socket.io 관리자 페이지 설정
  instrument(io, {
    auth: false,
    mode: 'development'
  });

  io.on('connection', async (socket) => {
    console.log(`${socket.data.decoded.index} connected`);
    socketService.joinRoom(socket);

    socket.on('message', (message) => {
      console.log(message, ' from ', socket.id);
      socket.emit('message', message);
    });

    for (const room of roomDumy) {
      await socket.join(room);
    }

    socket.on('send', ({ message, roomId }) => {
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
