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
    switch(todayInterest) {
      case 1 :
        // 가까운 거리 순 (같은 학교)
      break;

      case 2 :
        // 나와 관심사가 비슷한 categoryMatch (다 대 다)
      break;

      case 3 : 
        // 같은 학번 
      break;

      case 4 : 
        // 최근에 글을 쓴 사용자
      break;
    }
  };

  // 같은 학교인지 확인하는 로직
  public async sameSchool(
    userId : number
  ):Promise<void> {

  };

  // <1> 가까운 거리 순 (같은 학교)
  public async closeDistance(
    userId : number
  ):Promise<void> {

  };

  // <2> 나와 관심사가 비슷한 categoryMatch
  public async sameInterestCategory(
    userId : number
  ):Promise<void> {

  };

  // <3> 같은 학번
  public async sameGrade(
    userId : number
  ):Promise<void> {

  };

  // <4> 최근에 글을 쓴 사용자
  public async recentPostUser(
    userId : number
  ):Promise<void> {

  };
}

