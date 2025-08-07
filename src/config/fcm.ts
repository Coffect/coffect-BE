import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Firebase Admin SDK 초기화 함수
function initializeFirebase() {
  // 환경 변수 확인
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase 환경 변수가 설정되지 않았습니다.');
    console.error('필요한 환경 변수: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return;
  }

  try {
    // Private Key 개행 문자 처리
    const processedPrivateKey = Buffer.from(privateKey, 'base64').toString('utf-8');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: processedPrivateKey
      })
    });
    console.log('Firebase Admin SDK 초기화 성공');
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
  }
}

// Firebase 초기화 실행
initializeFirebase();

export class FCMService {
  /**
   * Firebase가 초기화되었는지 확인
   */
  private static isFirebaseInitialized(): boolean {
    return admin.apps.length > 0;
  }

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
      // Firebase가 초기화되지 않은 경우 처리
      if (!this.isFirebaseInitialized()) {
        console.log('Firebase가 초기화되지 않아 FCM 전송을 건너뜁니다.');
        return false;
      }

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
      
      // 토큰이 유효하지 않은 경우 삭제
      if (error instanceof Error && error.message.includes('InvalidRegistration')) {
        console.log(`유효하지 않은 FCM 토큰 삭제: ${userId}`);
        await this.removeUserFCMToken(userId);
      }
      
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
    try {
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
    } catch (error) {
      console.error('CoffeeChat 제안 알림 전송 실패:', error);
      return false;
    }
  }

  /**
   * 사용자 FCM 토큰 저장/업데이트
   */
  static async saveUserFCMToken(userId: number, fcmToken: string): Promise<boolean> {
    try {
      await prisma.userFCMToken.upsert({
        where: { userId },
        update: { fcmToken },
        create: { userId, fcmToken }
      });
      console.log(`FCM 토큰 저장/업데이트 성공: ${userId}`);
      return true;
    } catch (error) {
      console.error('FCM 토큰 저장/업데이트 실패:', error);
      return false;
    }
  }

  /**
   * 사용자 FCM 토큰 삭제
   */
  static async removeUserFCMToken(userId: number): Promise<boolean> {
    try {
      await prisma.userFCMToken.deleteMany({
        where: { userId }
      });
      console.log(`FCM 토큰 삭제 성공: ${userId}`);
      return true;
    } catch (error) {
      console.error('FCM 토큰 삭제 실패:', error);
      return false;
    }
  }

  /**
   * Firebase 상태 확인
   */
  static getFirebaseStatus(): { initialized: boolean; error?: string } {
    if (this.isFirebaseInitialized()) {
      return { initialized: true };
    } else {
      return { 
        initialized: false, 
        error: 'Firebase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.' 
      };
    }
  }

} 
