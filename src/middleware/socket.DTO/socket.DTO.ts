export interface ServerToClientEvents {
  receive: (data: {
    sender: number;
    senderName: string;
    message: string;
  }) => void;
  error: (err: any) => void;
  errorAck: (err: any) => void;
}

export interface ClientToServerEvents {
  send: (data: { message: string; chatRoomId: string }) => void;
  error: (err: any) => void;
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
