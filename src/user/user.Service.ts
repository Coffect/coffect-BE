import {
  accessToken,
  decodeToken,
  refreshToken,
  verifyToken
} from '../config/token';
import {
  UserExistID,
  UserInvaildPassword,
  UserMissingFieldError,
  UserNotExist
} from './user.Message';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserSignUpRequest,
  UserSignUpResponse
} from '../middleware/user.DTO/user.DTO';
import { UserModel } from './user.Model';
import { createHashedPassword, verifyPassword } from '../config/crypto';
import { JwtExpiredError, JwtTokenInvaild } from '../middleware/error';
import { Request } from 'express';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  public async loginService(userLogin: UserLoginRequest) {
    const userInfo = await this.userModel.selectUserInfo(userLogin.id);
    if (userInfo) {
      const hashedData = [userLogin.password, userInfo.salt, userInfo.password];
      const verify = await verifyPassword(hashedData);
      if (verify) {
        const atoken = accessToken(userInfo.name, userInfo.userId);
        const rToken = refreshToken(userInfo.name, userInfo.userId);
        const token = decodeToken(rToken);
        const userAgent = userLogin.req.headers['user-agent'] || '';
        await this.userModel.insertRefreshToken(token, rToken, userAgent);
        return new UserLoginResponse(atoken, rToken);
      }
      throw new UserInvaildPassword('비밀번호가 맞지 않습니다');
    }
    throw new UserNotExist('존재하지 않는 아이디입니다');
  }

  public async refreshService(req: Request) {
    const userToken = req.headers['authorization'];
    const userAgent = req.headers['user-agent'] || '';
    if (userToken === '') {
      throw new UserMissingFieldError('헤더에 토큰이 존재하지 않습니다.');
    }

    const auth = await verifyToken(userToken!, true);
    const tokenInfo = await this.userModel.selectRefreshToken(auth.index);
    if (tokenInfo) {
      if (userToken !== tokenInfo.tokenHashed) {
        throw new JwtTokenInvaild('유효하지 않은 토큰입니다.');
      }

      const newAccessToken = accessToken(auth.userName, auth.index);
      const newRefreshToken = refreshToken(auth.userName, auth.index);
      const token = decodeToken(newRefreshToken);
      await this.userModel.insertRefreshToken(
        token,
        newRefreshToken,
        userAgent
      );
      return new UserLoginResponse(newAccessToken, newRefreshToken);
    }

    throw new JwtTokenInvaild(
      'DB에 사용자 로그인 정보가 존재하지 않습니다. 다시 로그인해주세요'
    );
  }

  public async signUpService(info: UserSignUpRequest) {
    const { hashedPassword, userSalt } = await createHashedPassword(
      info.password
    );
    info.hashed = hashedPassword;
    info.salt = userSalt;
    await this.userModel.insertUser(info);
  }

  public async idCheckService(id: string) {
    const isDup =
      (await this.userModel.selectUserInfo(id)) === null ? false : true;
    if (isDup) {
      throw new UserExistID('아이디가 중복됨');
    }
  }
}
