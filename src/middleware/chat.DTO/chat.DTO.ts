export interface ChatRoomsDTO {
  chatroomId: string;
  userId: number;
  lastMessage: string | null;
  check: boolean | null;
}
export interface ChatRoomInfoDTO {
  chatroomId: string;
  userId: number;
  lastMessage: string | null;
  check: boolean | null;
  lastMeesageTime: Date | null;
}

export interface ChatDataDTO {
  id: string;
  chatRoomId: string;
  userId: number;
  messageBody: string;
  createdAt: Date;
  isPhoto: boolean;
  check: boolean;
}
