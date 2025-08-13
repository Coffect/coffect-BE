

export class coffectChatCardDTO {
  userId : number; // 상대방 userid
  name : string;
  grade : number;
  introduce : string;
  categoryMatch : string[]; // 배열로 받아야함
  profileImage : string;

  constructor(userId : number, name : string, grade : number, introduce : string, categoryMatch : string[], profileImage : string) {
    this.userId = userId;
    this.name = name;
    this.grade = grade;
    this.introduce = introduce;
    this.categoryMatch = categoryMatch;
    this.profileImage = profileImage;
  }
};

export class CoffeeChatSchedule {
  opponentId: string;
  opponentName: string;
  coffeeDate: Date;
  location: string;
  restDate: number; // 남은 일수 (number로 변경)
  firstUserImage: string;
  secondUserImage: string;

  constructor(
    opponentId: string,
    opponentName: string,
    coffeeDate: Date,
    location: string,
    restDate: number, // 남은 일수 (number로 변경)
    firstUserImage: string,
    secondUserImage: string
  ) {
    this.opponentId = opponentId;
    this.opponentName = opponentName;
    this.coffeeDate = coffeeDate;
    this.location = location;
    this.restDate = restDate;
    this.firstUserImage = firstUserImage;
    this.secondUserImage = secondUserImage;
  }
};


export class CoffeeChatRecord {
  coffectId : number;
  opponentName : string;
  color1 : string;
  color2 : string;
  coffeeDate : Date;

  constructor (
    coffectId : number,
    opponentName : string,
    color1 : string,
    color2 : string,
    coffeeDate : Date
  ) {
    this.coffectId = coffectId;
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

export class CoffeeChatShowUpDTO{
  coffectId : number;
  firstUserId : number;
  firstUserName : string;
  message : string;
  createdAt : Date;

  constructor(
    coffectId : number,
    firstUserId : number,
    firstUserName : string,
    message : string,
    createdAt : Date
  ) {
    this.coffectId = coffectId;
    this.firstUserId = firstUserId;
    this.firstUserName = firstUserName;
    this.message = message;
    this.createdAt = createdAt;
  }
}