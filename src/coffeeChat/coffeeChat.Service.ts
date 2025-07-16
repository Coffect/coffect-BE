import { HomeModel } from './coffeeChat.Model';


export class HomeService {
  private homeModel: HomeModel;

  constructor() {
    this.homeModel = new HomeModel();
  }

  public async postTodayInterestService(
    userId : number,
    todayInterest : number
  ):Promise<void> {
    await this.homeModel.postTodayInterestModel(userId, todayInterest);
  }   
}