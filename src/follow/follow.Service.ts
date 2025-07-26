import { FollowModel } from './follow.Model';

export class FollowService {
  private FollowModel: FollowModel;

  constructor() {
    this.FollowModel = new FollowModel();
  }


  public async FollowRequestService(
    userId: number,
    oppentUserId: number
  ):Promise<void> {
    await this.FollowModel.FollowRequestModel(userId, oppentUserId);
  };

  public async ShowUpFollowCountService(
    userId: number
  ):Promise<number[]> {
    const result = await this.FollowModel.ShowUpFollowCountModel(userId);
    
    return result;
  };

}