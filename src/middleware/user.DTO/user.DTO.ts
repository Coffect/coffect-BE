import { Request } from 'express';
import { Example, FormField } from 'tsoa';

export class UserLoginResponse {
  aToken: string;
  rToken: string;

  constructor(aToken: string, rToken: string) {
    this.aToken = aToken;
    this.rToken = rToken;
  }
}

export class UserLoginBody {
  @Example<string>('seoki')
    userId!: string;
  @Example<string>('1234')
    userPassword!: string;
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
  email: string;
  name: string;
  profile: string;
  interest: number[];
  hashed: string;
  salt: string;
  univId: number;
  dept: string;
  studentId: number;

  constructor(req: Request) {
    this.password = req.body.password;
    this.id = req.body.id;
    this.email = req.body.email;
    this.name = req.body.name;
    this.univId = Number(req.body.univId);
    this.dept = req.body.dept;
    this.studentId = Number(req.body.studentId);
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
