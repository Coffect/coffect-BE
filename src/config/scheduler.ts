/**
 *   node-cron
 *    unix 계열 Job Scheduler 기반 패키지
 *    타이머 혹은 주기적인 작업을 수행할 때 사용한다.
 */

import cron from 'node-cron';
import { prisma } from './prisma.config';

// 스케줄러 함수 정의
const resetDailyFields = async () => {
  console.log('Daily reset job started at:', new Date().toISOString());
  
  try {
    // 먼저 전체 사용자 수 확인
    const totalUsers = await prisma.user.count();
    console.log(`Total users in database: ${totalUsers}`);
    
    // 모든 사용자의 daily 필드 초기화
    const result = await prisma.user.updateMany({
      where: {}, // 모든 사용자 대상
      data: {
        coffeeChatCount: 4,
        todayInterest: null,
        todayInterestArray: []
      }
    });
    
    console.log(`Daily reset completed. Updated ${result.count} users out of ${totalUsers} total users`);
    
    // 변경된 사용자 수가 전체 사용자 수와 일치하는지 확인
    if (result.count !== totalUsers) {
      console.warn(`Warning: Only ${result.count} users were updated, but there are ${totalUsers} total users`);
    }
  } catch (err) {
    console.error('Failed to reset daily fields:', err);
  }
};

// 매일 한국 시간 00시에 실행 (UTC 15시)
cron.schedule('0 15 * * *', resetDailyFields);
console.log('Scheduler started - will run daily at 00:00 KST (15:00 UTC)');
