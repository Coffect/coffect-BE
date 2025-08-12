export interface ServerToClientEvents {
  receive: (data: {
    sender: number;
    senderName: string;
    message: string;
  }) => void;
  errorAck: (err: any) => void;
}

export interface ClientToServerEvents {
  send: (data: { message: string; chatRoomId: string }) => void;
  disconnect: () => void;
}

export interface InterServerEvents {
  error: (err: any) => void;
}

export interface SocketData {
  decoded: {
    index: number;
    userName: string;
  };
}
