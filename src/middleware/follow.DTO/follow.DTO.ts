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