import { Example } from 'tsoa';

type UserInfo = {
  name: string;
  introduce?: string;
  profileImage: string;
  dept: string;
  studentId: number;
  UnivList: { name: string };
};

type Category = {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
};

export class ProfileDTO {
  threadCount: number;
  following: number;
  follower: number;
  userInfo: UserInfo;
  interest: Category[];

  constructor(data: [number, number, number, object, object]) {
    this.threadCount = data[0];
    this.following = data[1];
    this.follower = data[2];
    this.userInfo = data[3] as UserInfo;
    this.interest = data[4] as Category[];
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
  @Example('[1,2,3,4]')
  interest!: number[];
}

export class DetailProfileBody {
  @Example('Q. 어떤 분야에서 성장하고 싶나요?')
  question!: string;
  @Example(
    '스타트업 창업과 제품 기획 분야에서 전문성을 쌓고 싶어요. 특히 사용자 중심의 서비스를 만드는 PM 역할에 관심이 많습니다.'
  )
  answer!: string;
  @Example(true)
  isMain!: boolean;

  constructor(data: { question: string; answer: string; isMain: boolean }) {
    this.question = data.question;
    this.answer = data.answer;
    this.isMain = data.isMain;
  }
}
