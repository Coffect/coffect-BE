import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertService {
  /**
   * 사용자의 알림 목록 조회
   */
  async getNotificationsService(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // 최근 50개만 조회
    });

    return notifications;
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
    secondUserId: number,
    firstUserId: number,
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
