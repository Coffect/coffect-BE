import { BasicError } from '../middleware/error';

export class UserServerError extends BasicError {
  constructor(description: string) {
    super(500, 'EC500', '서버 오류가 발생했습니다.', description);
  }
}

export class UserNotSignUpError extends BasicError {
  constructor(description: string) {
    super(400, 'EC400', '회원 정보를 입력하지 않은 유저입니다.', description);
  }
}

export class UserUnauthorizedError extends BasicError {
  constructor(description: string) {
    super(401, 'EC401', '인증 오류, 토큰이 존재하지 않습니다.', description);
  }
}

export class UserForbiddenError extends BasicError {
  constructor(description: string) {
    super(403, 'EC403', '만료된 토큰입니다.', description);
  }
}

export class UserMissingFieldError extends BasicError {
  constructor(description: string) {
    super(400, 'EC400', '누락값이 존재합니다.', description);
  }
}

export class UserInvalidBodyError extends BasicError {
  constructor(description: string) {
    super(400, 'EC400', '잘못된 요청 데이터입니다.', description);
  }
}
export class UserNotExist extends BasicError {
  constructor(description: string) {
    super(404, 'EC404', '존재하지 않는 아이디입니다', description);
  }
}
export class UserInvaildPassword extends BasicError {
  constructor(description: string) {
    super(401, 'EC401', '비밀번호가 일치하지 않습니다', description);
  }
}

//회원가입
export class UserExistID extends BasicError {
  constructor(description: string) {
    super(405, 'EC405', '이미 중복된 아이디입니다.', description);
  }
}
