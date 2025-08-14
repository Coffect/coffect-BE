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

export class SocketDatabaseError extends BasicError {
  constructor(description: string) {
    super(503, 'EC503', '데이터베이스 연결 오류가 발생했습니다.', description);
  }
}

export class SocketTimeoutError extends BasicError {
  constructor(description: string) {
    super(408, 'EC408', '소켓 요청 시간이 초과되었습니다.', description);
  }
}