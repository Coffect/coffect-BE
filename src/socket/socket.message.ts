import { BasicError } from '../middleware/error';

export class SocketMessageError extends BasicError {
  constructor(description: string) {
    super(400, 'EC400', '소켓 메시지 오류가 발생했습니다.', description);
  }
}

export class SocketConnectionError extends BasicError {
  constructor(description: string) {
    super(500, 'EC500', '소켓 연결 오류가 발생했습니다.', description);
  }
}