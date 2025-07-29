import { deleteFromS3, uploadToS3 } from '../config/s3';
import {
  ProfileDTO,
  ProfileUpdateDTO
} from '../middleware/follow.DTO/profile.DTO';
import { UserService } from '../user/user.Service';
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

  public async updateProfile(info: ProfileUpdateDTO) {
    await new UserService().idCheckService(info.id);
    if (info.img) {
      info.profileImage = await uploadToS3(info.img);
      info.img = undefined;
      const profile = await this.profileModel.selectUserProfileImg(info.userId);
      await deleteFromS3(profile.profileImage);
    }
    await this.profileModel.updataUserProfile(info);
  }
}
