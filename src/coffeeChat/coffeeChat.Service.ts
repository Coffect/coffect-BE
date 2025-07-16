import { coffectChatCardDTO } from '../middleware/coffectChat.DTO/coffectChat.DTO';
import { HomeModel } from './coffeeChat.Model';


export class HomeService {
  private homeModel: HomeModel;

  constructor() {
    this.homeModel = new HomeModel();
  }

  /**  */
  public async postTodayInterestService(
    userId : number,
    todayInterest : number
  ):Promise<void> {
    await this.homeModel.postTodayInterestModel(userId, todayInterest);
  }   

  /**  */
  public async CardCoffeeChatService(
    userId : number
  ): Promise<coffectChatCardDTO | number> {
    // 0. todayInterestArray 값 불러오기 -> 존재하면 3번으로 이동

    // 1. todayInterestArray가 존재하지 않으면 todayInterest 값 불러오기

    // 2. todayinterest값이 존재하지 않으면 0를 출력 - error 처리 0를 return함.    

    // 2-2. todayInterest값이 존재하다면 todayInterestArray값을 채워넣기 (최대 3개 배열)

    // 3. coffeeChatCount값 불러오기

    // 3-1. coffeeChatCount값이 0이라면 - error 처리

    // 3-2. coffeeChatCount값이 1이상 4 미만이라면 todayInterestArray값을 index 기반으로 정보 보여주기

    return 0;
  }
}