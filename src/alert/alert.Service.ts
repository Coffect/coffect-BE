import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertService {
  /**
   * 사용자의 알림 목록 조회
   */
  async getNotificationsService(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: { 
        userId,
        isRead: false // 읽지 않은 알림만 조회
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // 최근 50개만 조회
    });

    // firstUserId들을 수집
    const firstUserIds = new Set<number>();
    notifications.forEach(notification => {
      if (notification.data && typeof notification.data === 'object') {
        const data = notification.data as any;
        if (data.type === 'coffee_chat_proposal' && data.firstUserId) {
          const firstUserId = parseInt(data.firstUserId);
          if (!isNaN(firstUserId)) {
            firstUserIds.add(firstUserId);
          }
        }
      }
    });

    // 한 번에 모든 사용자 정보 조회
    const users = await prisma.user.findMany({
      where: {
        userId: { in: Array.from(firstUserIds) }
      },
      select: {
        userId: true,
        profileImage: true,
        name: true
      }
    });

    // 사용자 정보를 Map으로 변환하여 빠른 접근 가능하게 함
    const userMap = new Map(users.map(user => [user.userId, user]));

    // 알림에 사용자 정보 추가
    const notificationsWithUserImages = notifications.map(notification => {
      if (notification.data && typeof notification.data === 'object') {
        const data = notification.data as any;
        if (data.type === 'coffee_chat_proposal' && data.firstUserId) {
          const firstUserId = parseInt(data.firstUserId);
          if (!isNaN(firstUserId)) {
            const user = userMap.get(firstUserId);
            if (user) {
              return {
                ...notification,
                firstUserImage: user.profileImage,
                firstUserName: user.name
              };
            }
          }
        }
      }
      return notification;
    });

    return notificationsWithUserImages;
  }

  /**
   * 특정 알림 읽음 처리
   */
  async markAsReadService(userId: number, notificationId: number) {
    const notification = await prisma.notification.findFirst({
      where: {
        notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    await prisma.notification.update({
      where: { notificationId },
      data: { isRead: true }
    });
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsReadService(userId: number) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCountService(userId: number): Promise<number> {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    return count;
  }

  /**
   * CoffeeChat 제안 알림 생성 및 전송
   */
  async sendCoffeeChatProposalNotification(
    secondUserId: number, // 받는 사람
    firstUserId: number, // 보내는 사람람
    coffectId: number
  ) {
    console.log(`커피챗 제안 알림 시작: 보내는 사용자 ${firstUserId} -> 받는 사용자 ${secondUserId}, 커피챗 ID: ${coffectId}`);

    // firstUser 정보 조회
    const firstUser = await prisma.user.findUnique({
      where: { userId: firstUserId },
      select: { name: true }
    });

    if (!firstUser) {
      console.error(`사용자를 찾을 수 없습니다: ${firstUserId}`);
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    console.log(`사용자 정보 조회 성공: ${firstUser.name}`);

    // FCM 알림 전송
    try {
      const { FCMService } = await import('../config/fcm');
      const result = await FCMService.sendCoffeeChatProposalNotification(
        secondUserId,
        firstUserId,
        firstUser.name,
        coffectId
      );
      
      console.log(`FCM 알림 전송 완료: ${result ? '성공' : '실패'}`);
      return result;
    } catch (error) {
      console.error('FCM 알림 전송 중 오류 발생:', error);
      throw error;
    }
  }
}
