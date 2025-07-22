import { coffectChatCardDTO, CoffeeChatSchedule } from '../middleware/coffectChat.DTO/coffectChat.DTO';
import { exceedLimitError, postTodayError } from './coffeeChat.Message';
import { HomeModel } from './coffeeChat.Model';

export class HomeService {
  private homeModel: HomeModel;

  constructor() {
    this.homeModel = new HomeModel();
  }

  /** 하루 관심사 삽입 서비스 로직 */
  public async postTodayInterestService(
    userId: number,
    todayInterest: number
  ): Promise<void> {
    await this.homeModel.postTodayInterestModel(userId, todayInterest);
  }

  /** 추천 로직 서비스 */
  public async CardCoffeeChatService(
    userId: number
  ): Promise<coffectChatCardDTO> {
    // 0. todayInterestArray 값 불러오기
    let todayInterestArray = await this.homeModel.getTodayInterestArray(userId);

    // 1. todayInterestArray가 비어있으면 생성
    if (!todayInterestArray || todayInterestArray.length === 0) {
      const getTodayInterestValue =
        await this.homeModel.getTodayInterestValue(userId);

      // 2. todayInterest값이 유효하지 않으면 예외 발생
      if (
        !getTodayInterestValue ||
        ![1, 2, 3, 4].includes(getTodayInterestValue)
      ) {
        throw new postTodayError('주제를 먼저 선정해주세요.');
      }

      // 2-2. todayInterestArray 생성
      await this.homeModel.postTodayInterestArray(
        userId,
        getTodayInterestValue
      );

      // 다시 조회해서 제대로 생성되었는지 확인
      todayInterestArray = await this.homeModel.getTodayInterestArray(userId);

      if (!todayInterestArray || todayInterestArray.length === 0) {
        throw new Error('Failed to create todayInterestArray');
      }
    }

    // 3. coffeeChatCount 값 불러오기
    const coffeeChatCount = await this.homeModel.getCoffeeChatCount(userId);

    // 3-1. coffeeChatCount가 0이라면 예외 발생
    if (coffeeChatCount <= 0) {
      throw new exceedLimitError('오늘 하루 추천 커피챗 횟수를 초과했습니다.');
    }

    // 3-2. 추천 사용자 선택 (coffeeChatCount를 인덱스로 사용)
    const recommendIndex = coffeeChatCount - 1; // 1-based를 0-based로 변환

    if (recommendIndex >= todayInterestArray.length) {
      throw new Error(
        `Invalid recommend index: ${recommendIndex}, array length: ${todayInterestArray.length}`
      );
    }

    const recommendUserId = todayInterestArray[recommendIndex];

    // 3-3. coffeeChatCount 감소 (추천 후)
    await this.homeModel.decreaseCoffeeChatCount(userId);

    // 3-4. 추천된 사용자의 프로필 반환
    const showFrontProfile =
      await this.homeModel.showFrontProfile(recommendUserId);

    return showFrontProfile; // 항상 CoffectChatCardDTO 반환
  }

  /** 커피챗 제안 서비스 */
  public async postSuggestCoffeeChatService(
    myUserId: number,
    otherUserid: number,
    suggestion: string
  ): Promise<void> {
    await this.homeModel.postSuggestCoffeeChatModel(
      myUserId,
      otherUserid,
      suggestion
    );
  }

  public async GetCoffeeChatScheduleService(
    userId : number
  ):Promise<CoffeeChatSchedule[]> {
    
    const result = await this.homeModel.GetCoffeeChatScheduleModel(userId);

    return result;
  }
}