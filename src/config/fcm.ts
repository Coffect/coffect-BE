import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Firebase Admin SDK 초기화 함수
function initializeFirebase() {
  if (!admin.apps.length) {
    try {
      // Private key 처리
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey) {
        // 환경 변수에서 가져온 private key의 이스케이프 문자 처리
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        // 모든 'n' 문자를 줄바꿈으로 변환
        privateKey = privateKey.replace(/n/g, '\n');
        
        // 따옴표로 감싸진 경우 제거
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
        }
        
        // 추가적인 공백 제거
        privateKey = privateKey.trim();
        
        // 디버깅을 위한 로그 (민감한 정보는 마스킹)
        console.log('Private key 처리 완료:', privateKey.substring(0, 50) + '...');
        
        // Private key 유효성 검사
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
          console.error('Private key 형식이 올바르지 않습니다.');
          return;
        }
      }

      // 필수 환경 변수 확인
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn('Firebase 환경 변수가 설정되지 않았습니다. FCM 기능이 비활성화됩니다.');
        console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '설정됨' : '설정되지 않음');
        console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '설정됨' : '설정되지 않음');
        console.log('FIREBASE_PRIVATE_KEY:', privateKey ? '설정됨' : '설정되지 않음');
        return;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      console.log('Firebase Admin SDK 초기화 성공');
    } catch (error) {
      console.error('Firebase Admin SDK 초기화 실패:', error);
      console.warn('FCM 기능이 비활성화됩니다.');
    }
  }
}

// Firebase 초기화 실행
initializeFirebase();

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
      // Firebase가 초기화되지 않은 경우 처리
      if (!admin.apps.length) {
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