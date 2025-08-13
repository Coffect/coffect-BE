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
  UserNotExist,
  UserServerError
} from './user.Message';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserSignUpRequest
} from '../middleware/user.DTO/user.DTO';
import { UserModel } from './user.Model';
import { createHashedPassword, verifyPassword } from '../config/crypto';
import { JwtTokenInvaild } from '../middleware/error';
import { Request } from 'express';
import { uploadToS3 } from '../config/s3';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  public async loginService(
    userLogin: UserLoginRequest
  ): Promise<UserLoginResponse> {
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

  public async refreshService(req: Request): Promise<UserLoginResponse> {
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

  public async signUpService(
    info: UserSignUpRequest,
    img: Express.Multer.File
  ): Promise<void> {
    await this.idCheckService(info.id);
    const { hashedPassword, userSalt } = await createHashedPassword(
      info.password
    );
    info.hashed = hashedPassword;
    info.salt = userSalt;
    info.profile = await uploadToS3(img);

    try {
      await this.userModel.insertUser(info);
    } catch (err) {
      console.log(err);
      throw new UserServerError('데이터베이스 삽입에 실패했습니다.');
    }
  }

  public async idCheckService(id: string): Promise<void> {
    const isDup =
      (await this.userModel.selectUserInfo(id)) === null ? false : true;
    if (isDup) {
      throw new UserExistID('아이디가 중복됨');
    }
  }

  //TODO: 로그아웃 시 FCM 알림기능도 삭제 필요
  public async logoutService(userId: number): Promise<void> {
    await this.userModel.deleteRefreshToken(userId);
  }
}
