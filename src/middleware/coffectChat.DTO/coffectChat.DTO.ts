

export class coffectChatCardDTO {
    name : string;
    grade : string;
    introduce : string;
    categoryMatch : string[]; // 배열로 받아야함
    profileImage : string;
    mail : string;

    constructor(name : string, grade : string, introduce : string, categoryMatch : string[], profileImage : string, mail : string) {
        this.name = name;
        this.grade = grade;
        this.introduce = introduce;
        this.categoryMatch = categoryMatch;
        this.profileImage = profileImage;
        this.mail = mail;
    }
}


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
}