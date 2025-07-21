import { UnivCertRequest } from '../middleware/univ.DTO/univ.DTO';
import {
  CertCodeExpired,
  CertCodeInvaild,
  CertCodeNotMatch
} from './univ.Message';
import { UnivModel } from './univ.Model';

export class UnivService {
  private univModel: UnivModel;
  constructor() {
    this.univModel = new UnivModel();
  }
  public async certService(info: UnivCertRequest) {
    const certInfo = await this.univModel.selectCertInfo(info);
    const now = new Date();
    const utc = new Date(now.toISOString());

    if (certInfo === null) {
      throw new Error(); //이메일 오류
    }
    if (certInfo.certCode !== info.certCode) {
      throw new CertCodeNotMatch('인증코드가 일치하지 않습니다.'); // 인증번호가 일치하지 않음
    }
    if (!certInfo.valid) {
      throw new CertCodeInvaild('인증코드가 유효하지 않습니다.');
    }
    if (certInfo.expiredAt < utc) {
      throw new CertCodeExpired('인증코드가 만료되었습니다.');
    }
    console.log('here');
  }
}
