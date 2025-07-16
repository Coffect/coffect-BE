import { BasicError } from '../middleware/error';

export class postTodayError extends BasicError {
  constructor(description: string) {
    super (
      400,
      'HE400',
      '주제 선정해주세요.',
      description
    );
  }
}