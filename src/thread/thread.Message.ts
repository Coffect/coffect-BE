import { BasicError } from '../middleware/error';

export class ThreadNotFoundError extends BasicError {
  constructor(message: string) {
    super(404,'THR-01','게시물을 찾을 수 없습니다.', message);
  }
}

export class ThreadCreateError extends BasicError {
  constructor(message: string) {
    super(500, 'THR-02', '게시글 업로드에 실패했습니다.', message);
  }
}

export class ThreadTransactionError extends BasicError {
  constructor(message: string) {
    super(500, 'THR-03', '게시글 트랜잭션 처리에 실패했습니다.', message);
  }
}