import { prisma } from '../config/prisma.config';
import { specifyFeedDTO, specifyProfileDTO } from '../middleware/follow.DTO/follow.DTO';
import { notExsistUser } from './follow.Message';

// 시간 차이를 계산하는 유틸리티 함수
function getTimeDifference(createdAt: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return createdAt.toLocaleDateString('ko-KR');
  }
}

export class FollowModel {
  public async FollowRequestModel(
    userId: number,
    oppentUserId: number
  ): Promise<boolean> {
    // 사용자 존재 여부 확인
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { userId } }),
      prisma.user.findUnique({ where: { userId: oppentUserId } })
    ]);

    if (!follower || !following) {
      throw new notExsistUser('사용자를 찾을 수 없습니다.');
    }

    // 팔로우 여부
    const isFollow = await prisma.follow.findFirst({
      where : {
        followerId : userId,
        followingId : oppentUserId
      },
      select : {
        id : true
      }
    });

    if (!isFollow?.id) {
      // User 필드는 prisma.follow.create의 data에 존재하지 않으므로 제거
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: oppentUserId
        }
      });  
      
      return true;
    } else {
      await prisma.follow.delete({
        where : {
          id : isFollow.id
        }
      });

      return false;
    }
  };

  public async ShowUpFollowCountModel(
    userId: number
  ): Promise<number[]> {
    /* 이거 개헷갈리는데...
     userId에 해당하는 follower 수 => follwingId의 수를 count (userId가 아닌)
                    followerId가 userId인 것들의 수를 count
     userId에 해당하는 following 수 => followerId의 수를 count (userId가 아닌)
                    followingId가 userId인 것들의 수를 count
    */
    const followerCount = await prisma.follow.count({
      where: {
        followerId: userId
      }
    });

    const followingCount = await prisma.follow.count({
      where: {
        followingId: userId
      }
    });

    return [followerCount, followingCount];
  };

  public async isFollowModel(
    userId: number,
    oppentUserId: number
  ): Promise<boolean> {
    const result = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: oppentUserId
      }
    });

    if (!result) {
      return false;
    }

    return true;
  };

};

export class specifyProfileModel {

  /** 프로필 조회 */
  public async showProfileModel(
    userId: number
  ): Promise<specifyProfileDTO> {
    const result = await prisma.user.findUniqueOrThrow({
      where: {
        userId: userId
      },
      select: {
        name: true,
        introduce: true,
        profileImage: true
      }
    });

    if (result.introduce == null) {
      result.introduce = '';
    }
    return new specifyProfileDTO(result.name, result.introduce, result.profileImage);
  };

  /** feed 조회 */
  public async showAllFeedModel(
    profile: specifyProfileDTO,
    userId: number
  ): Promise<specifyFeedDTO[]> {
    const result = await prisma.thread.findMany({
      where: { userId: userId },
      select: {
        thradBody: true,
        createdAt: true
      }
    });

    const feed = result.map((item) => {
      const timeAgo = getTimeDifference(item.createdAt);
      return new specifyFeedDTO(profile, item.thradBody ?? '', timeAgo);
    });

    return feed;
  };


  /** feed 갯수 세는 API */
  public async ShowFeedCountModel(
    userId: number
  ): Promise<number> {
    const result = await prisma.thread.count({
      where: { userId: userId }
    });

    return result;
  };

};