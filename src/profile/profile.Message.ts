import { BasicError } from '../middleware/error';

export class UserServerError extends BasicError {
  constructor(description: string) {
    super(500, 'EC500', '서버 오류가 발생했습니다.', description);
  }
}

export class UserIdNotFound extends BasicError {
  constructor(description: string) {
    super(404, 'EC404', '유저 아이디를 찾을 수 없습니다.', description);
  }
}
