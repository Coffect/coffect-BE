import { accessToken, refreshToken } from '../config/token';
import { UserInvaildPassword, UserNotExist } from './user.Message';
import { UserLogin } from '../middleware/user.DTO/user.DTO';
import { UserModel } from './user.Model';
import { verifyPassword } from '../config/crypto';

export class UserService {
  static async loginService(userid: string, userPassword: string) {
    const userInfo = await UserModel.loginModel(userid, userPassword);
    if (userInfo) {
      const hashedData = [userPassword, userInfo.salt, userInfo.password];
      const verify = await verifyPassword(hashedData);
      if (verify) {
        const atoken = accessToken(userInfo.name, userInfo.userId);
        const rToken = refreshToken(userInfo.name, userInfo.userId);
        return new UserLogin(atoken, rToken);
      }
      throw new UserInvaildPassword('비밀번호가 일치하지 않습니다');
    }
    throw new UserNotExist('존재하지 않는 아이디입니다');
  }

  static async refreshService(decoded: any) {
    console.log(decoded);
  }
}
