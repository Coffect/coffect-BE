import {
  DeptSearchResponse,
  UnivCertRequest,
  UnivSearchResponse
} from '../middleware/univ.DTO/univ.DTO';
import {
  CertCodeExpired,
  CertCodeInvaild,
  CertCodeNotMatch,
  DomainNotFound,
  DomainNotMatch,
  InvaildEmail,
  UserServerError
} from './univ.Message';
import { UnivModel } from './univ.Model';
import { getChoseong } from 'es-hangul';

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
  }

  public async searchService(univName: string) {
    const inital = getChoseong(univName);
    let isInitial = false;
    let index = 0;
    let pure = '';
    for (const word of univName) {
      if (word === inital[index]) {
        break;
      }
      pure += word;
      index++;
    }

    const last = inital.substring(index);
    if (index === 0) isInitial = true; //초성검색을 따로 분류

    const result = await this.univModel.searchUnivName(pure, last, isInitial);

    return new UnivSearchResponse(result);
  }

  public async deptService(search: string, univName: string) {
    const result = await this.univModel.searchDept(search, univName);
    return new DeptSearchResponse(result);
  }

  public async domainService(email: string, univ: string): Promise<void> {
    const univDomain = await this.univModel.searchUniv(univ);
    const domain = email.split('@')[1];
    if (univDomain === null) {
      throw new UserServerError('서버 오류가 발생했습니다.');
    }
    if (univDomain !== domain) {
      throw new DomainNotMatch('학교 정보와 이메일이 일치하지 않습니다.');
    }
    if (domain === undefined) {
      throw new InvaildEmail('이메일 형식이 아닙니다.');
    }
    const result = await this.univModel.searchDomain(domain);
    if (result === null) {
      throw new DomainNotFound('도메인이 존재하지 않습니다.');
    }
  }
}
