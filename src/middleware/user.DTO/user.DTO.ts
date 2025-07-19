import e, { Request } from 'express';

export class UserLoginResponse {
  aToken: string;
  rToken: string;

  constructor(aToken: string, rToken: string) {
    this.aToken = aToken;
    this.rToken = rToken;
  }
}

export class UserLoginRequest {
  id: string;
  password: string;
  req: Request;

  constructor(id: string, password: string, req: Request) {
    this.id = id;
    this.password = password;
    this.req = req;
  }
}

export class UserSignUpResponse {}
export class UserSignUpRequest {
  password: string;
  id: string;
  univ: string;
  major: string;
  studentId: number;
  email: string;
  name: string;
  profile: string;
  interest: number[];
  hashed: string;
  salt: string;

  constructor(req: Request) {
    this.password = req.body.userInfo.password;
    this.id = req.body.userInfo.id;
    this.univ = req.body.userInfo.univ;
    this.major = req.body.userInfo.major;
    this.studentId = req.body.userInfo.studentId;
    this.email = req.body.userInfo.email;
    this.name = req.body.userInfo.name;
    this.interest = req.body.userInfo.interest;
    this.profile = req.body.profile;
    this.hashed = '';
    this.salt = '';
  }
}
