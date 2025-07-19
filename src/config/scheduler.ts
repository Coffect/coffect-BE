/**
 *   node-cron
 *    unix 계열 Job Scheduler 기반 패키지
 *    타이머 혹은 주기적인 작업을 수행할 때 사용한다.
 */

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cron.schedule('0 0 * * *', async () => {
  // 00시(다음 날)가(이) 되면 coffeeChatCount와 todayInterest 칼럼을 초기화 시킨다.
  try {
    await prisma.user.updateMany({
      data: {
        coffeeChatCount: 4,
        todayInterest: null,
        todayInterestArray: null
      }
    });
    console.log('user coffeeChatCount and todayInterest reset complete');
  } catch (err) {
    console.error('Failed to reset daily fields:', err);
  }
});
