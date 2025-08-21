import { Example } from 'tsoa';

export class UnivCertRespone {
  aToken: string;
  rToken: string;

  constructor(aToken: string, rToken: string) {
    this.aToken = aToken;
    this.rToken = rToken;
  }
}
export class UnivCertBody {
  @Example(123456)
    certCode!: number;
  @Example('seoki180@inha.edu')
    email!: string;
}
export class UnivCertRequest {
  certCode: number;
  email: string;

  constructor(certCode: number, email: string) {
    this.certCode = certCode;
    this.email = email;
  }
}
export type UnivList = {
  id: number;
  name: string;
  location: string | null;
};

export class UnivSearchBody {
  @Example('인하')
    univName!: string;
}

export class UnivSearchResponse {
  univList: UnivList[];

  constructor(univList: UnivList[]) {
    this.univList = univList;
  }
}

type DeptList = {
  location: string;
  univ: string;
  college: string;
  dept: string;
};
export class DeptSearchBody {
  @Example('인하')
    univName!: string;
  @Example('컴퓨터공학과')
    search!: string;
}
export class DeptSearchResponse {
  deptList: DeptList[];

  constructor(deptList: DeptList[]) {
    this.deptList = deptList;
  }
}

export class UnivDomainBody {
  @Example('seoki180@inha.edu')
    email!: string;
  @Example('인하대학교')
    univ!: string;
}
