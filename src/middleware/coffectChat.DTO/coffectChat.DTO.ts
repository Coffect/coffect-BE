

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