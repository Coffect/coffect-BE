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
