import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertModel {
  /**
   * 사용자의 알림 목록 조회
   */
  async getNotifications(userId: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  /**
   * 특정 알림 읽음 처리
   */
  async markAsRead(notificationId: number, userId: number) {
    return await prisma.notification.update({
      where: {
        notificationId,
        userId
      },
      data: { isRead: true }
    });
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: number) {
    return await prisma.notification.updateMany({
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
  async getUnreadCount(userId: number): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  /**
   * 사용자 FCM 토큰 저장/업데이트
   */
  async saveUserFCMToken(userId: number, fcmToken: string) {
    return await prisma.userFCMToken.upsert({
      where: { userId },
      update: { fcmToken },
      create: { userId, fcmToken }
    });
  }

  /**
   * 사용자 FCM 토큰 삭제
   */
  async removeUserFCMToken(userId: number) {
    return await prisma.userFCMToken.deleteMany({
      where: { userId }
    });
  }

  /**
   * 사용자 FCM 토큰 조회
   */
  async getUserFCMToken(userId: number) {
    return await prisma.userFCMToken.findUnique({
      where: { userId }
    });
  }
}
