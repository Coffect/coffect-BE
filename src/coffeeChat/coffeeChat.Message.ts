import { BasicError } from '../middleware/error';

export class postTodayError extends BasicError {
  constructor(description: string) {
    super(400, 'HE400', '주제 선정해주세요.', description);
  }
}

export class exceedLimitError extends BasicError {
  constructor(description: string) {
    super(
      400,
      'HE401',
      '오늘 하루 추천 커피챗 횟수를 초과 했습니다.',
      description
    );
  }
}

export class nonPostComment extends BasicError {
  constructor(description: string) {
    super(400, 'HE402', '내용이 누락되어있습니다.', description);
  }
}

export class nonData extends BasicError {
  constructor(description: string) {
    super (
      400,
      'HE404',
      '존재하지 않는 Data입니다.',
      description
    );
  }
}