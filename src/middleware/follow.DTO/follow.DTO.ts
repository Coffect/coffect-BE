export class specifyFeedDTO {
  specifyProfile: specifyProfileDTO;
  threadBody: string;
  timeAgo: string;

  constructor(
    specifyProfile: specifyProfileDTO,
    threadBody: string,
    timeAgo: string
  ) {
    this.specifyProfile = specifyProfile;
    this.threadBody = threadBody;
    this.timeAgo = timeAgo;
  }
}

export class specifyProfileDTO {
  name: string;
  introduce: string;
  profileImage: string;

  constructor(name: string, introduce: string, profileImage: string) {
    this.name = name;
    this.introduce = introduce;
    this.profileImage = profileImage;
  }
}

export class followerListup {
  userId: number;
  id: string;
  name: string;
  profileImage: string;
  studentId: string;
  dept: string;
  idCursor: number | null | undefined;

  constructor(userId: number, id: string, name: string, profileImage: string, studentId: string, dept: string, idCursor: number | null | undefined) {
    this.userId = userId;
    this.id = id;
    this.name = name;
    this.profileImage = profileImage;
    this.studentId = studentId;
    this.dept = dept;
    this.idCursor = idCursor;
  }
}