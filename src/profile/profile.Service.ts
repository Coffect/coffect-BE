import { deleteFromS3, uploadToS3 } from '../config/s3';
import {
  ProfileDTO,
  ProfileUpdateDTO,
  DetailProfileBody
} from '../middleware/detailProfile.DTO/detailProfile.DTO';
import { ResponseFromSingleThreadWithLikes } from '../middleware/thread.DTO/thread.DTO';
import { UserModel } from '../user/user.Model';
import { UserService } from '../user/user.Service';
import { UserIdNotFound } from './profile.Message';
import { ProfileModel } from './profile.Model';

export class ProfileService {
  private profileModel: ProfileModel;

  constructor() {
    this.profileModel = new ProfileModel();
  }

  public async myProfile(userId: number) {
    const data = await this.profileModel.selectUserProfile(userId);
    return new ProfileDTO(data as [number, number, number, object, object[]]);
  }

  public async getProfile(id: string) {
    const user = await new UserModel().selectUserInfo(id);
    const data = await this.profileModel.selectUserProfile(user?.userId!);
    return new ProfileDTO(data as [number, number, number, object, object[]]);
  }

  public async getThread(id?: string, userIndex?: number) {
    const threads: ResponseFromSingleThreadWithLikes[] = [];
    if (id) {
      const userId = await new UserModel().selectUserInfo(id);
      const data = await this.profileModel.selectUserThread(userId?.userId!);
      for (const item of data.data) {
        threads.push({
          result: item,
          likes: data.likes[data.data.indexOf(item)]
        });
      }
    } else {
      const data = await this.profileModel.selectUserThread(userIndex!);
      for (const item of data.data) {
        threads.push({
          result: item,
          likes: data.likes[data.data.indexOf(item)]
        });
      }
    }
    return threads;
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

  public async updateInterest(userId: number, interest: number[]) {
    await this.profileModel.deleteInterest(userId);
    await this.profileModel.insertInterest(userId, interest);
  }

  public async updateDetailProfile(userId: number, body: DetailProfileBody[]) {
    await this.profileModel.updateSpecificInfo(userId, body);
  }

  public async getDetailProfile(userId: number) {
    const data = await this.profileModel.selectSpecificInfo(userId);
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const temp: DetailProfileBody[] = [];
    for (const item of data as {
      question: string;
      answer: string;
      isMain: boolean;
    }[]) {
      const element = new DetailProfileBody(item);
      temp.push(element);
    }
    return temp;
  }

  public async getUserId(userId: number) {
    const data = await this.profileModel.selectUserId(userId);
    if (!data) {
      throw new UserIdNotFound('유저 아이디를 찾을 수 없습니다.');
    }
    return data;
  }
}
