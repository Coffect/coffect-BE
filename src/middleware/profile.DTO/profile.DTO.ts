import { Example } from 'tsoa';

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
export class SearchUserDTO {
  id: string;
  name: string;
  userId: number;
  profileImage: string;

  constructor(id: string, name: string, userId: number, profileImage: string) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.profileImage = profileImage;
  }
}
