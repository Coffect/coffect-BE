import { BasicError } from '../middleware/error';

export class ThreadNotFoundError extends BasicError {
  constructor(message: string) {
    super(404, 'THR-01', '게시물을 찾을 수 없습니다.', message);
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

export class ThreadNoID extends BasicError {
  constructor(message: string) {
    super(400, 'THR-04', '게시글 ID가 없습니다.', message);
  }
}

export class ThreadInvalidOrderByError extends BasicError {
  constructor(message: string) {
    super(400, 'THR-05', '유효하지 않은 정렬 기준입니다.', message);
  }
}

export class ThreadUnauthorizedError extends BasicError {
  constructor(message: string) {
    super(401, 'THR-06', '게시글 접근 권한이 없습니다.', message);
  }
}

export class ThreadImageUploadError extends BasicError {
  constructor(message: string) {
    super(500, 'THR-07', '게시글 이미지 업로드에 실패했습니다.', message);
  }
}

export class ThreadPostCommentError extends BasicError {
  constructor(message: string) {
    super(500, 'THR-08', '댓글 작성에 실패했습니다.', message);
  }
}

export class ThreadScrapError extends BasicError {
  constructor(message: string) {
    super(500, 'THR-09', '게시글 스크랩에 실패했습니다.', message);
  }
}