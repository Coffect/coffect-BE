import { accessToken, decodeToken, refreshToken } from '../config/token';
import { UserInvaildPassword, UserNotExist } from './user.Message';
import { UserLogin } from '../middleware/user.DTO/user.DTO';
import { UserModel } from './user.Model';
import { verifyPassword } from '../config/crypto';
import { Request } from 'express';

export class UserService {
  static async loginService(
    userid: string,
    userPassword: string,
    req: Request
  ) {
    const userInfo = await UserModel.selectUserInfo(userid);
    if (userInfo) {
      const hashedData = [userPassword, userInfo.salt, userInfo.password];
      const verify = await verifyPassword(hashedData);
      if (verify) {
        const atoken = accessToken(userInfo.name, userInfo.userId);
        const rToken = refreshToken(userInfo.name, userInfo.userId);
        const token = await decodeToken(rToken);
        const userAgent = req.headers['user-agent']!;
        await UserModel.insertRefreshToken(token, rToken, userAgent);
        return new UserLogin(atoken, rToken);
      }
      throw new UserInvaildPassword('비밀번호가 맞지 않습니다');
    }
    throw new UserNotExist('존재하지 않는 아이디입니다');
  }

  static async refreshService(decoded: any) {
    console.log(decoded);
  }
}
