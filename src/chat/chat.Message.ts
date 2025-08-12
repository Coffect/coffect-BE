import { BasicError } from '../middleware/error';

export class UserServerError extends BasicError {
  constructor(description: string) {
    super(500, 'EC500', '서버 오류가 발생했습니다.', description);
  }
}

export class ChatRoomAlreadyExists extends BasicError {
  constructor(description: string) {
    super(409, 'EC409', '이미 채팅방이 존재합니다.', description);
  }
}

export class ChatRoomNotFound extends BasicError {
  constructor(description: string) {
    super(404, 'EC404', '채팅방을 찾을 수 없습니다.', description);
  }
}

export class uploadFail extends BasicError {
  constructor(description: string) {
    super(400, 'EC400', '사진을 올리는 중 오류가 발생했습니다.', description);
  }
}