import { BasicError } from '../middleware/error';

export class UserServerError extends BasicError {
  constructor(description: string) {
    super(500, 'EC500', '서버 오류가 발생했습니다.', description);
  }
}
export class CertCodeNotMatch extends BasicError {
  constructor(description: any) {
    super(401, 'EC1', '인증코드가 일치하지 않습니다.', description);
  }
}
export class CertCodeInvaild extends BasicError {
  constructor(description: any) {
    super(401, 'EC2', '인증코드가 유효하지 않습니다.', description);
  }
}
export class CertCodeExpired extends BasicError {
  constructor(description: any) {
    super(401, 'EC3', '인증코드가 만료되었습니다,', description);
  }
}

export class DomainNotFound extends BasicError {
  constructor(description: any) {
    super(401, 'EC4', '도메인이 존재하지 않습니다.', description);
  }
}

export class InvaildEmail extends BasicError {
  constructor(description: any) {
    super(401, 'EC5', '이메일이 유효하지 않습니다.', description);
  }
}

export class DomainNotMatch extends BasicError {
  constructor(description: any) {
    super(401, 'EC6', '학교 정보와 이메일이 일치하지 않습니다.', description);
  }
}
