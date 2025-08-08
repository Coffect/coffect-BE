export interface ServerToClientEvents {
  receive: (
    data: {
      sender: number;
      senderName: string;
      message: string;
    }
  ) => void;
}

export interface ClientToServerEvents {
  send: (
    data: {
      message: string;
      roomId: string;
    }
  ) => void;
  disconnect: () => void;
}

export interface InterServerEvents {

}

export interface SocketData {
  decoded: {
    index: number;
    name: string;
  }
}