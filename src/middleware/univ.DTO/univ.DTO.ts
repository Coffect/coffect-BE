export class UnivCertRespone {
  aToken: string;
  rToken: string;

  constructor(aToken: string, rToken: string) {
    this.aToken = aToken;
    this.rToken = rToken;
  }
}
export class UnivCertRequest {
  certCode: number;
  email: string;

  constructor(certCode: number, email: string) {
    this.certCode = certCode;
    this.email = email;
  }
}
type UnivList = {
  name: string;
  location: string | null;
};

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
export class DeptSearchResponse {
  deptList: DeptList[];

  constructor(deptList: DeptList[]) {
    this.deptList = deptList;
  }
}
