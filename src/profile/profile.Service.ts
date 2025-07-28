import { ProfileDTO } from '../middleware/profile.DTO/temp.DTO';
import { ProfileModel } from './profile.Model';

export class ProfileService {
  private profileModel: ProfileModel;

  constructor() {
    this.profileModel = new ProfileModel();
  }

  public async myProfile(userId: number) {
    const data = await this.profileModel.selectUserProfile(userId);
    return new ProfileDTO(data);
  }
}
