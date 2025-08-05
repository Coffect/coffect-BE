import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export class FCMService {
  /**
   * 특정 사용자에게 FCM 알림 전송
   */
  static async sendNotificationToUser(
    userId: number,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<boolean> {
    try {
      // 사용자의 FCM 토큰 조회
      const userFCMToken = await prisma.userFCMToken.findUnique({
        where: { userId }
      });

      if (!userFCMToken) {
        console.log(`FCM 토큰이 없는 사용자: ${userId}`);
        return false;
      }

      // FCM 메시지 생성
      const message: admin.messaging.Message = {
        token: userFCMToken.fcmToken,
        notification: {
          title,
          body
        },
        data: data || {},
        android: {
          notification: {
            channelId: 'coffect_notifications',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      // FCM 전송
      const response = await admin.messaging().send(message);
      console.log('FCM 전송 성공:', response);
      return true;
    } catch (error) {
      console.error('FCM 전송 실패:', error);
      return false;
    }
  }

  /**
   * CoffeeChat 제안 알림 전송
   */
  static async sendCoffeeChatProposalNotification(
    secondUserId: number,
    firstUserId: number,
    firstUserName: string,
    coffectId: number
  ): Promise<boolean> {
    const title = '커피챗 제안';
    const body = `${firstUserName}님의 커피챗 제안이 도착했어요!`;
    const data = {
      type: 'coffee_chat_proposal',
      firstUserId: firstUserId.toString(),
      coffectId: coffectId.toString(),
      firstUserName: firstUserName
    };

    // FCM 알림 전송
    const fcmSuccess = await this.sendNotificationToUser(secondUserId, title, body, data);

    // 데이터베이스에 알림 기록 저장
    if (fcmSuccess) {
      await prisma.notification.create({
        data: {
          userId: secondUserId,
          type: 'coffee_chat_proposal',
          title,
          body,
          data: data
        }
      });
    }

    return fcmSuccess;
  }

  /**
   * 사용자 FCM 토큰 저장/업데이트
   */
  static async saveUserFCMToken(userId: number, fcmToken: string): Promise<void> {
    await prisma.userFCMToken.upsert({
      where: { userId },
      update: { fcmToken },
      create: { userId, fcmToken }
    });
  }

  /**
   * 사용자 FCM 토큰 삭제
   */
  static async removeUserFCMToken(userId: number): Promise<void> {
    await prisma.userFCMToken.deleteMany({
      where: { userId }
    });
  }
} 