import { SuccessResponse } from 'tsoa';
import { accessToken, refreshToken } from '../config/token';
import { UserForbiddenError, UserUnauthorizedError } from './user.Message';
import { UserLogin } from '../middleware/user.DTO/user.DTO';

export class UserService {
  static async loginService(userid: string, userPassword: string) {
    console.log({ userid, userPassword });
    const userIndex = 1;
    const userName = 'seoki';
    const atoken = accessToken(userName, userIndex);
    const rToken = refreshToken(userName, userIndex);
    // throw new UserUnauthorizedError('테스트');
    console.log(atoken);
    const result = new UserLogin(atoken, rToken);
    return result;
  }

  static async refreshService(decoded: any) {
    console.log(decoded);
  }
}
