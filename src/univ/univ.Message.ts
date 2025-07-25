import { BasicError } from '../middleware/error';

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
