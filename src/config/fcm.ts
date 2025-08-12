import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Firebase Admin SDK 초기화 함수
function initializeFirebase() {
  // 환경 변수 확인
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log('Firebase 초기화 시작...');
  console.log('Project ID 존재:', !!projectId);
  console.log('Client Email 존재:', !!clientEmail);
  console.log('Private Key 존재:', !!privateKey);

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Firebase 환경 변수가 설정되지 않았습니다.');
    console.error('필요한 환경 변수: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return;
  }

  try {
    // Private Key 처리 - base64 디코딩 시도
    let processedPrivateKey = privateKey;
    
    try {
      // base64로 인코딩된 경우 디코딩
      const decoded = Buffer.from(privateKey, 'base64').toString('utf-8');
      if (decoded.includes('-----BEGIN PRIVATE KEY-----')) {
        processedPrivateKey = decoded;
        console.log('Private Key base64 디코딩 성공');
      } else {
        console.log('Private Key가 이미 일반 텍스트 형태입니다');
      }
    } catch (decodeError: unknown) {
      const errorMessage = decodeError instanceof Error ? decodeError.message : 'Unknown error';
      console.log('Private Key base64 디코딩 실패, 원본 사용:', errorMessage);
    }

    // 개행 문자 처리
    processedPrivateKey = processedPrivateKey
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');

    console.log('Firebase Admin SDK 초기화 시도...');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: processedPrivateKey
      })
    });
    console.log('Firebase Admin SDK 초기화 성공');
  } catch (error: unknown) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
    if (error instanceof Error) {
      console.error('에러 상세 정보:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('알 수 없는 에러 타입:', error);
    }
  }
}

// Firebase 초기화 실행
initializeFirebase();

// Firebase 상태 로깅
setTimeout(() => {
  const status = FCMService.getFirebaseStatus();
  console.log('Firebase 초기화 상태:', status);
}, 1000);

export class FCMService {
  /**
   * Firebase가 초기화되었는지 확인
   */
  private static isFirebaseInitialized(): boolean {
    return admin.apps.length > 0;
  }

  /**
   * 특정 사용자에게 FCM 알림 전송
   * 
   * @param userId - 알림을 받을 사용자 ID
   * @param title - 알림 제목 (프론트엔드에서 표시됨)
   * @param body - 알림 내용 (프론트엔드에서 표시됨)
   * @param data - 추가 데이터 (프론트엔드에서 알림 클릭 시 사용됨)
   * @returns Promise<boolean> - 전송 성공 여부
   * 
   * 프론트엔드 응답 값 위치:
   * - title: 알림 제목으로 표시
   * - body: 알림 내용으로 표시  
   * - data: 알림 클릭 시 전달되는 추가 정보
   * - android.channelId: 'coffect_notifications' - 안드로이드 알림 채널
   * - android.priority: 'high' - 높은 우선순위
   * - apns.payload.aps.sound: 'default' - iOS 알림음
   * - apns.payload.aps.badge: 1 - iOS 뱃지 카운트
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

      if (!userFCMToken || !userFCMToken.fcmToken) {
        console.log(`FCM 토큰이 없는 사용자: ${userId}`);
        return false;
      }

      console.log(`FCM 토큰 조회 성공: 사용자 ${userId}, 토큰: ${userFCMToken.fcmToken.substring(0, 20)}...`);

      // FCM 메시지 생성
      const message: admin.messaging.Message = {
        token: userFCMToken.fcmToken,
        notification: {
          title, // 프론트엔드에서 알림 제목으로 표시
          body   // 프론트엔드에서 알림 내용으로 표시
        },
        data: data || {}, // 프론트엔드에서 알림 클릭 시 전달되는 추가 데이터
        android: {
          notification: {
            channelId: 'coffect_notifications', // 안드로이드 알림 채널 ID
            priority: 'high',                   // 높은 우선순위
            defaultSound: true,                 // 기본 알림음 사용
            defaultVibrateTimings: true         // 기본 진동 패턴 사용
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default', // iOS 알림음
              badge: 1          // iOS 뱃지 카운트
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
   * 
   * @param secondUserId - 알림을 받을 사용자 ID (커피챗 제안을 받는 사람)
   * @param firstUserId - 커피챗을 제안한 사용자 ID
   * @param firstUserName - 커피챗을 제안한 사용자 이름
   * @param coffectId - 커피챗 ID
   * @returns Promise<boolean> - 전송 성공 여부
   * 
   * 프론트엔드에서 받는 알림 내용:
   * - title: "커피챗 제안"
   * - body: "{firstUserName}님의 커피챗 제안이 도착했어요!"
   * - data.type: "coffee_chat_proposal"
   * - data.firstUserId: 제안한 사용자 ID
   * - data.coffectId: 커피챗 ID
   * - data.firstUserName: 제안한 사용자 이름
   */
  static async sendCoffeeChatProposalNotification(
    secondUserId: number,
    firstUserId: number,
    firstUserName: string,
    coffectId: number
  ): Promise<boolean> {
    try {
      const title = '커피챗 제안'; // 프론트엔드에서 표시될 알림 제목
      const body = `${firstUserName}님의 커피챗 제안이 도착했어요!`; // 프론트엔드에서 표시될 알림 내용
      const data = {
        type: 'coffee_chat_proposal',           // 알림 타입 (프론트엔드에서 알림 처리 시 사용)
        firstUserId: firstUserId.toString(),   // 제안한 사용자 ID (프론트엔드에서 사용자 정보 조회 시 사용)
        coffectId: coffectId.toString(),       // 커피챗 ID (프론트엔드에서 커피챗 상세 페이지 이동 시 사용)
        firstUserName: firstUserName           // 제안한 사용자 이름 (프론트엔드에서 표시)
      };

      // 데이터베이스에 알림 기록 저장 (FCM 전송 성공 여부와 관계없이)
      try {
        await prisma.notification.create({
          data: {
            userId: secondUserId,
            type: 'coffee_chat_proposal',
            title,
            body,
            data: data
          }
        });
        console.log(`알림 DB 저장 성공: 사용자 ${secondUserId}`);
      } catch (dbError) {
        console.error('알림 DB 저장 실패:', dbError);
      }

      // FCM 알림 전송
      const fcmSuccess = await this.sendNotificationToUser(secondUserId, title, body, data);

      if (fcmSuccess) {
        console.log(`FCM 전송 성공: 사용자 ${secondUserId}`);
      } else {
        console.log(`FCM 전송 실패: 사용자 ${secondUserId} (토큰이 없거나 유효하지 않음)`);
      }

      return fcmSuccess;
    } catch (error) {
      console.error('CoffeeChat 제안 알림 전송 실패:', error);
      return false;
    }
  }

  /**
   * 사용자 FCM 토큰 저장/업데이트
   * 
   * @param userId - 사용자 ID
   * @param fcmToken - FCM 토큰 (프론트엔드에서 Firebase SDK로 생성된 토큰)
   * @returns Promise<boolean> - 저장/업데이트 성공 여부
   * 
   * 프론트엔드에서 이 함수를 직접 호출하지 않음.
   * 프론트엔드는 /alert/registerFCMToken API를 통해 토큰을 등록함.
   */
  static async saveUserFCMToken(userId: number, fcmToken: string): Promise<boolean> {
    try {
      // 토큰 유효성 검사
      if (!fcmToken || fcmToken.trim().length === 0) {
        console.error('유효하지 않은 FCM 토큰:', fcmToken);
        return false;
      }

      await prisma.userFCMToken.upsert({
        where: { userId },
        update: { fcmToken },
        create: { userId, fcmToken }
      });
      console.log(`FCM 토큰 저장/업데이트 성공: 사용자 ${userId}, 토큰: ${fcmToken.substring(0, 20)}...`);
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
