

export class coffectChatCardDTO {
  name : string;
  grade : number;
  introduce : string;
  categoryMatch : string[]; // 배열로 받아야함
  profileImage : string;

  constructor(name : string, grade : number, introduce : string, categoryMatch : string[], profileImage : string) {
    this.name = name;
    this.grade = grade;
    this.introduce = introduce;
    this.categoryMatch = categoryMatch;
    this.profileImage = profileImage;
  }
};

export class CoffeeChatSchedule {
  opponentId: string;
  coffeeDate: Date;
  location: string;
  restDate: Date;
  firstUserImage: string;
  secondUserImage: string;

  constructor(
    opponentId: string,
    coffeeDate: Date,
    location: string,
    restDate: Date,
    firstUserImage: string,
    secondUserImage: string
  ) {
    this.opponentId = opponentId;
    this.coffeeDate = coffeeDate;
    this.location = location;
    this.restDate = restDate;
    this.firstUserImage = firstUserImage;
    this.secondUserImage = secondUserImage;
  }
};


export class CoffeeChatRecord {
  opponentName : string;
  color1 : string;
  color2 : string;
  coffeeDate : Date;

  constructor (
    opponentName : string,
    color1 : string,
    color2 : string,
    coffeeDate : Date
  ) {
    this.opponentName = opponentName;
    this.color1 = color1;
    this.color2 = color2;
    this.coffeeDate = coffeeDate;
  }
};

export class CoffeeChatRecordDetail {
  opponentName : string;
  color1 : string;
  color2 : string;
  coffeeDate : Date;
  location : string;
  firstUserImage : string;
  secondUserImage : string;

  constructor (
    opponentName : string,
    color1 : string,
    color2 : string,
    coffeeDate : Date,
    location : string,
    firstUserImage : string,
    secondUserImage : string
  ) {
    this.opponentName = opponentName;
    this.color1 = color1;
    this.color2 = color2;
    this.coffeeDate = coffeeDate;
    this.location = location;
    this.firstUserImage = firstUserImage;
    this.secondUserImage = secondUserImage;
  }
};