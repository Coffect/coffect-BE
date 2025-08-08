export interface ServerToClientEvents {
  receive: (data: {
    sender: number;
    senderName: string;
    message: string;
  }) => void;
}

export interface ClientToServerEvents {
  send: (data: { message: string; chatRoomId: string }) => void;
  disconnect: () => void;
}

export interface InterServerEvents {}

export interface SocketData {
  decoded: {
    index: number;
    userName: string;
  };
}
