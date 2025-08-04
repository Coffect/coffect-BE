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

export class UserTimeTableError extends BasicError {
  constructor(description: string){
    super(500, 'PR-03', '시간표 업로드에 실패했습니다.', description);
  }
}

export class UserTimeTableDuplicateError extends BasicError {
  constructor(description: string){
    super(409, 'PR-04', '이미 시간표가 존재합니다.', description);
  }
}