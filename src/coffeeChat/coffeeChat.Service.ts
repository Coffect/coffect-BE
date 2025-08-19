import { coffectChatCardDTO, CoffeeChatRecord, CoffeeChatRecordDetail, CoffeeChatSchedule, CoffeeChatShowUpDTO } from '../middleware/coffectChat.DTO/coffectChat.DTO';
import { exceedLimitError, postTodayError } from './coffeeChat.Message';
import { HomeModel } from './coffeeChat.Model';

export class HomeService {
  private homeModel: HomeModel;

  constructor() {
    this.homeModel = new HomeModel();
  };

  /** 하루 관심사 삽입 서비스 로직 */
  public async postTodayInterestService(
    userId: number,
    todayInterest: number
  ): Promise<void> {
    await this.homeModel.postTodayInterestModel(userId, todayInterest);
  };

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
        ![1, 2, 3, 4].includes(getTodayInterestValue) ||
        getTodayInterestValue === 0
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
  };

  /** 현재 coffeeChatCount값에 따른 사용자 추천 */
  public async currentCardRecommendService(
    userId : number
  ):Promise<coffectChatCardDTO> {
    
    const coffeeChatCount = await this.homeModel.getCoffeeChatCount(userId);

    if(coffeeChatCount <= 0) {
      throw new exceedLimitError('오늘 하루 추천 커피챗 횟수를 초과 했습니다.');
    }

    const todayInterestArray = await this.homeModel.getTodayInterestArray(userId);

    // 현재 coffeeChatCount를 인덱스로 사용 (감소된 값)
    const recommendIndex = coffeeChatCount;

    if (recommendIndex >= todayInterestArray.length) {
      throw new Error(
        `Invalid recommend index: ${recommendIndex}, array length: ${todayInterestArray.length}`
      );
    }

    const recommendUserId = todayInterestArray[recommendIndex];

    const result = await this.homeModel.showFrontProfile(recommendUserId);

    return result;
  };

  /** 커피챗 제안 서비스 */
  public async postSuggestCoffeeChatService(
    myUserId: number,
    otherUserid: number,
    suggestion: string
  ): Promise<void> {
    console.log(`커피챗 제안 서비스 시작: ${myUserId} -> ${otherUserid}`);

    // CoffeeChat 생성
    const coffectId = await this.homeModel.postSuggestCoffeeChatModel(
      myUserId,
      otherUserid,
      suggestion
    );

    console.log(`커피챗 생성 완료: ID ${coffectId}`);

    // 알림 전송
    try {
      const { AlertService } = await import('../alert/alert.Service');
      const alertService = new AlertService();
      const notificationResult = await alertService.sendCoffeeChatProposalNotification(
        otherUserid, // secondUserId (받는 사람)
        myUserId,    // firstUserId (보내는 사람)
        coffectId
      );
      
      console.log(`알림 전송 결과: ${notificationResult ? '성공' : '실패'}`);
    } catch (error) {
      console.error('알림 전송 실패:', error);
      // 알림 전송 실패해도 커피챗 제안은 성공으로 처리
    }
  };

  public async GetCoffeeChatScheduleService(
    userId : number
  ):Promise<CoffeeChatSchedule[]> {
    
    const result = await this.homeModel.GetCoffeeChatScheduleModel(userId);

    return result;
  };

  public async getPastCoffeeChatService(
    userId : number
  ):Promise<CoffeeChatRecord[]> {

    const result = await this.homeModel.getPastCoffeeChatModel(userId);

    return result;
  };

  public async getSpecifyCoffeeChatService(
    userId : number,
    coffectId : number
  ):Promise<CoffeeChatRecordDetail> {
    const result = await this.homeModel.getSpecifyCoffeeChatModel(userId, coffectId);

    return result;
  };

  public async fixCoffeeChatScheduleService(
    userId : number,
    coffectId : number,
    coffeeChat : Date,
    location : string,
    time : Date
  ):Promise<void> {
    await this.homeModel.fixCoffeeChatScheduleModel(userId, coffectId, coffeeChat, location, time);
  };

  public async acceptCoffeeChatService(
    userId : number,
    coffectId : number
  ):Promise<void> {
    await this.homeModel.acceptCoffeeChatModel(userId, coffectId);
    await this.homeModel.sendAcceptFCM(userId, coffectId); // userId는 승낙을 하는 사람임.
  };

  public async getTotalCoffeeChatCountService(
    userId : number
  ):Promise<number> {
    const result = await this.homeModel.getTotalCoffeeChatCountModel(userId);
    return result;
  };

  /** 스케줄러 수동 실행 서비스 */
  public async resetDailyFieldsService(): Promise<void> {
    await this.homeModel.resetDailyFieldsModel();
  };

  public async messageShowUpService(
    userId : number,
    coffectId : number
  ):Promise<CoffeeChatShowUpDTO> {
    const result = await this.homeModel.messageShowUpModel(userId, coffectId);
    return result;
  }

  public async deleteCoffeeChatService(
    userId : number,
    coffectId : number
  ):Promise<void> {
    await this.homeModel.deleteCoffeeChatModel(userId, coffectId);
  }
}