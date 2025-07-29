import { Example } from 'tsoa';

type UserInfo = {
  name: string;
  introduce?: string;
  profileImage: string;
  dept: string;
  studentId: number;
  //   univName: string;
  UnivList: { name: string };
};
export class ProfileDTO {
  threadCount: number;
  following: number;
  follower: number;
  userInfo: UserInfo;

  constructor(data: [number, number, number, object]) {
    this.threadCount = data[0];
    this.following = data[1];
    this.follower = data[2];
    this.userInfo = data[3] as UserInfo;
  }
}

export class ProfileUpdateDTO {
  id: string;
  name: string;
  introduce: string;
  userId: number;
  img?: Express.Multer.File;
  profileImage?: string = '';

  constructor(
    userId: number,
    id?: string,
    name?: string,
    introduce?: string,
    img?: Express.Multer.File
  ) {
    this.id = id || '';
    this.name = name || '';
    this.introduce = introduce || '';
    this.userId = userId;
    this.img = img;
  }
}

export class UpdateProfileBody {
  @Example('[1,2,3]')
  interest!: number[];
}
