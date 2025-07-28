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
