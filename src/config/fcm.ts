import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Firebase Admin SDK 초기화 함수
function initializeFirebase() {
  try {
    // 이미 초기화된 경우 스킵
    if (admin.apps.length) {
      console.log('Firebase가 이미 초기화되어 있습니다.');
      return;
    }

    // 필수 환경 변수 확인
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.error('Firebase 환경 변수가 누락되었습니다:');
      console.error(`- FIREBASE_PROJECT_ID: ${projectId ? '설정됨' : '누락'}`);
      console.error(`- FIREBASE_CLIENT_EMAIL: ${clientEmail ? '설정됨' : '누락'}`);
      console.error(`- FIREBASE_PRIVATE_KEY: ${privateKey ? '설정됨' : '누락'}`);
      console.log('FCM 기능이 비활성화됩니다.');
      return;
    }

    // Private key 처리 - \\n을 \n으로 변환
    let processedPrivateKey = privateKey;
    
    // 1. 따옴표 처리 - 양끝에 따옴표가 없으면 추가
    if (processedPrivateKey && !processedPrivateKey.startsWith('"') && !processedPrivateKey.endsWith('"')) {
      processedPrivateKey = `"${processedPrivateKey}"`;
      console.log('FIREBASE_PRIVATE_KEY에 따옴표를 추가했습니다.');
    }
    
    // 2. 따옴표 제거 (내부 처리용)
    if (processedPrivateKey.startsWith('"') && processedPrivateKey.endsWith('"')) {
      processedPrivateKey = processedPrivateKey.slice(1, -1);
    }
    
    // 3. \\n을 \n으로 변환 (환경 변수에서 이스케이프된 경우)
    processedPrivateKey = processedPrivateKey.replace(/\\n/g, '\n');
    
    // 4. n 문자를 \n으로 변환 (GitHub Actions에서 발생하는 경우)
    processedPrivateKey = processedPrivateKey.replace(/n/g, '\n');
    
    // 5. Private key 형식 검증
    if (!processedPrivateKey.includes('-----BEGIN PRIVATE KEY-----') || 
        !processedPrivateKey.includes('-----END PRIVATE KEY-----')) {
      console.error('Firebase Private Key 형식이 올바르지 않습니다.');
      console.log('FCM 기능이 비활성화됩니다.');
      return;
    }

    // Firebase Admin SDK 초기화
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: processedPrivateKey
      })
    });

    console.log('Firebase Admin SDK 초기화 성공');
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
    console.log('FCM 기능이 비활성화됩니다.');
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