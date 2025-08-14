export interface ServerToClientEvents {
  receive: (data: {
    sender: number;
    senderName: string;
    message: string;
    timestamp?: string;
  }) => void;
  errorAck: (err: {
    error: string;
    message: string;
    description: string;
  }) => void;
  userTyping: (data: {
    userId: number;
    userName: string;
    isTyping: boolean;
  }) => void;
  messageSeen: (data: {
    userId: number;
    userName: string;
    messageId: string;
  }) => void;
}

export interface ClientToServerEvents {
  send: (data: { message: string; chatRoomId: string }) => void;
  typing: (data: { chatRoomId: string; isTyping: boolean }) => void;
  seen: (data: { chatRoomId: string; messageId: string }) => void;
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
