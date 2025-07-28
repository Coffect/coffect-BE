import { uploadToS3, replaceFileInS3, deleteFromS3 } from '../config/s3';
import {
  ProfileDTO,
  ProfileUpdateDTO
} from '../middleware/profile.DTO/temp.DTO';
import { UserModel } from '../user/user.Model';
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
    }
    await this.profileModel.updataUserProfile(info);
  }
}
