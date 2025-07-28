import { Request } from 'express';

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
  email: string;
  name: string;
  profile: string;
  interest: number[];
  hashed: string;
  salt: string;

  constructor(req: Request) {
    this.password = req.body.password;
    this.id = req.body.id;
    this.univ = req.body.univ;
    this.major = req.body.major;
    this.email = req.body.email;
    this.name = req.body.name;
    this.profile = '';
    this.hashed = '';
    this.salt = '';

    if (req.body.interest === '') {
      this.interest = [];
    } else {
      this.interest = req.body.interest
        .split(',')
        .map((s: any) => Number(s.trim()));
    }
  }
}
