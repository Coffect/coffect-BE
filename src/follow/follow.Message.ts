import { BasicError } from '../middleware/error';

export class nonUser extends BasicError {
  constructor(description: string) {
    super(400, 'FE400', '상대방 UserId가 누락되었습니다.', description);
  }
};

export class nonProfile extends BasicError {
  constructor(description: string) {
    super(400, 'PE400', '프로필 조회에 실패하였습니다.', description);
  }
};