import { prisma } from '../config/prisma.config';


export class FollowModel {

  public async FollowRequestModel(
    userId: number,
    oppentUserId: number
  ):Promise<void> {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: oppentUserId,
        User:{
          connect: {
            userId : userId
          }
        }
      }
    });
  };

  public async ShowUpFollowCountModel(
    userId : number
  ):Promise<number[]> {
    /* 이거 개헷갈리는데...
     userId에 해당하는 follower 수 => follwingId의 수를 count (userId가 아닌)
                    followerId가 userId인 것들의 수를 count
     userId에 해당하는 following 수 => followerId의 수를 count (userId가 아닌)
                    followingId가 userId인 것들의 수를 count
    */
    const followerCount = await prisma.follow.count({
      where: {
        followerId : userId
      }
    });

    const followingCount = await prisma.follow.count({
      where : {
        followingId : userId
      }
    });

    return [followerCount, followingCount];
  };
    
}