import { followerListup, specifyFeedDTO, specifyProfileDTO } from '../middleware/follow.DTO/follow.DTO';
import { FollowModel, specifyProfileModel } from './follow.Model';

export class FollowService {
  private FollowModel: FollowModel;

  constructor() {
    this.FollowModel = new FollowModel();
  }

  public async FollowRequestService(
    userId: number,
    oppentUserId: number
  ):Promise<boolean> {
    const result = await this.FollowModel.FollowRequestModel(userId, oppentUserId);
    return result;
  };

  public async ShowUpFollowCountService(
    userId: number
  ):Promise<number[]> {
    const result = await this.FollowModel.ShowUpFollowCountModel(userId);
    
    return result;
  };

  public async isFollowService(
    userId: number,
    oppentUserId: number
  ):Promise<boolean> {
    const result = await this.FollowModel.isFollowModel(userId, oppentUserId);

    return result;
  }

  public async listUpFollowerService(
    oppentUserId : number,
    idCursor?: number
  ):Promise<followerListup[]> {
    const result = await this.FollowModel.listUpFollowerModel(oppentUserId, idCursor);

    return result;
  };

  public async listUpFollowingService(
    oppentUserId : number,
    idCursor?: number
  ):Promise<followerListup[]> {
    const result = await this.FollowModel.listUpFollowingModel(oppentUserId, idCursor);

    return result;
  };
};

export class specifyProfileService {
  private specifyProfileModel : specifyProfileModel;

  constructor() {
    this.specifyProfileModel = new specifyProfileModel();
  }

  public async showProfileService(
    userId : number
  ):Promise<specifyProfileDTO> {
    const result = await this.specifyProfileModel.showProfileModel(userId);

    return result;
  };


  public async showAllFeedService(
    userId : number
  ):Promise<specifyFeedDTO[]> {
    // 프로필 먼저 조회
    const profile = await this.specifyProfileModel.showProfileModel(userId);
    // feed 조회
    const result = await this.specifyProfileModel.showAllFeedModel(profile ,userId);

    return result;
  };

  public async ShowFeedCountService (
    userId : number
  ):Promise<number> {
    const result = await this.specifyProfileModel.ShowFeedCountModel(userId);

    return result;
  }
}