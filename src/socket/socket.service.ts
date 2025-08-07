import { Server, Socket } from 'socket.io';
import { SocketModel } from './socket.model';

export default class SocketService {
  private SocketModel: SocketModel;
  constructor() {
    this.SocketModel = new SocketModel();
  }
  public async joinRoom(socket: Socket) {
    const userId = socket.data.decoded.index;
    const rooms = await this.SocketModel.getRooms(userId);
    for (const room of rooms) {
      await socket.join(room);
    }
  }
}
