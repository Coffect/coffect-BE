import { PrismaClient } from '../../generated/prisma';
import { coffectChatCardDTO } from '../middleware/coffectChat.DTO/coffectChat.DTO';

const prisma = new PrismaClient();

export class HomeModel {

  // 하루 관심란 입력
  public async postTodayInterestModel (
    userId : number,
    todayInterest : number
  ):Promise<void> {
    await prisma.user.update({
      where : {userId : userId},
      data : {todayInterest : todayInterest}
    });
  };

  // userId에 해당하는 todayInterest 값 가져오기 (1,2,3,4)
  public async getTodayInterestValue (
    userId : number
  ):Promise<number> {
    const value = await prisma.user.findUniqueOrThrow({
      where : { userId : userId },
      select : { todayInterest : true }
    });

    if(value.todayInterest === 0) {
      return value.todayInterest;
    }

    if(value.todayInterest === null) {
      throw new Error (`Invalid todayInterest value for user ${userId}: ${value.todayInterest}`);
    }
    
    return value.todayInterest;
  };

  // userId에 해당하는 coffeeChatCount값 불러오기
  public async getCoffeeChatCount(
    userId: number
  ):Promise<number> {

    const result = await prisma.user.findUnique({
      where : {userId : userId},
      select : { coffeeChatCount : true }
    });

    return result!.coffeeChatCount;
  };

  // userId에 해당하는 coffeeChatCount값 감소하기
  public async decreaseCoffeeChatCount(
    userId : number
  ):Promise<void> {
    let result = await this.getCoffeeChatCount(userId) as number;

    // count 값이 0 이상이라면 1 감소 시키고 반영 시킴.
    if(result > 0) {
      result = result -1;

      await prisma.user.update({
        where : { userId : userId },
        data : { coffeeChatCount : result }
      });
    }
  };

  // userId에 해당하는 todayInterestArray 배열 가져오기
  public async getTodayInterestArray(
    userId : number
  ):Promise<number[] | null> {
    const result = await prisma.user.findUnique ({
      where : {userId : userId},
      select : { todayInterestArray : true}
    });

    return result?.todayInterestArray as number[] | null;
  };
  

  // 각 로직 별로 postTodainterestArray값을 userId로 채워넣는 함수 ( [3, 4, 5, 6] 총 4개 )
  public async postTodayInterestArray(
    userId : number,
    todayInterest : number
  ): Promise<void> {
    const filteredArray : number[] = await this.sameSchool(userId);

    switch(todayInterest) {
      case 1 :
        // 가까운 거리 순 (같은 학교)
      break;

      case 2 :
        // 나와 관심사가 비슷한 categoryMatch (다 대 다)
      break;

      case 3 : 
        // 같은 학번 
        await this.sameGrade(userId, filteredArray);
      break;

      case 4 : 
        // 최근에 글을 쓴 사용자
        await this.recentPostUser(userId, filteredArray);
      break;
    }
  };

  // 같은 학교사람 구분하는 로직
  private async sameSchool(
    userId : number
  ):Promise<number[]> {
    const result = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select : {mail : true}
    });

    // mail 도메인 추출
    const compareSameSchoole = await this.extractSchoolDomain(result.mail);

    if(compareSameSchoole === null || compareSameSchoole === undefined) {
      throw new Error(`Invalid email format: ${result.mail}`);
    }

    // 같은 학교 사용자 조회
    const sameSchoolUsers = await this.getUsersBySchoolDomain(userId, compareSameSchoole);

    return sameSchoolUsers;
  };

  // 이메일 도메인 추출
  private extractSchoolDomain(email: string): string | null {
    // 정규표현식: @ 다음부터 .kr 전까지
    const match = email.match(/@([^.]+)\.kr$/);
    return match ? match[1] : null;
  };

  // 같은 학교 도메인 추출
  private async getUsersBySchoolDomain(
    userId: number,
    schoolDomain: string
  ): Promise<number[]> {
    const users = await prisma.user.findMany({
      where: {
        userId: { not: userId },
        mail: { endsWith: `@${schoolDomain}.kr` }
      },
      select: { userId : true },
      take: 20
    });

    return users.map(user => user.userId);
  };

  // <1> 가까운 거리 순 (같은 학교)
  private async closeDistance(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {

  };

  // <2> 나와 관심사가 비슷한 categoryMatch
  private async sameInterestCategory(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {

  };

  // <3> 같은 학번
  private async sameGrade(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    let array : number[] = [];

    const userGrade = await prisma.user.findUniqueOrThrow({
      where : {userId : userId},
      select : {mail : true}
    });

    const currentGrade = this.extractGrade(userGrade!.mail);

    if(currentGrade === null || currentGrade === undefined) {
      throw new Error (`Cannot extract grade from email: ${userGrade.mail}`);
    }

    // filteredArray를 순회하면서 조건에 맞는 사용자를 탐색
    for(const targetUserId of filteredArray) {
      if(array.length > 4) {
        break;
      }

      const targetUser = await prisma.user.findFirst({
        where : { userId : targetUserId },
        select : {mail : true}
      });

      if(targetUser) {
        const targetGrade = this.extractGrade(targetUser.mail);

        if(targetGrade === currentGrade) {
          array.push(targetUserId);
        }
      }
    }
  };
  
  private extractGrade(email: string): string | null {
    // 202010836@school.kr에서 앞 4자리(2020) 추출
    const match = email.match(/^(\d{4})/);
    return match ? match[1] : null; 
  };

  // <4> 최근에 글을 쓴 사용자
  private async recentPostUser(
    userId : number,
    filteredArray : number[]
  ):Promise<void> {
    let array : number[] = []

    // 사용자별 최근 게시물 조회
    const userRecentThread = await prisma.user.findMany({
      where : { userId : { in: filteredArray }},
      select : {
        userId : true, 
        threads : {
          orderBy : {
            createdAt : 'desc' // 내림차순
          },
          take : 1, // 가장 최근 게시물 1개만 조회
          select : {
            createdAt : true
          }
        }
      }
    });

    // 최근 게시물이 존재하는 user별로 정렬 진행
    const userFilterThread = userRecentThread
    .filter( user => user.threads.length > 0) // 게시글이 존재하는 사용자만
    .map( user => ({
      userId: user.userId,
      createdAt : user.threads[0].createdAt
    }))
    .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0,4)
    .map(user => userId);

    array = userFilterThread;

    await prisma.user.update({
      where : {userId : userId},
      data : { todayInterestArray : array }
    })
  };

  public async showFrontProfile(
    userId: number
  ):Promise<coffectChatCardDTO> {
    const result : coffectChatCardDTO = ;


    return result;
  };
}

