import { PrismaClient } from '@prisma/client';
import {PrismaClient as mongoPrisma} from '../../node_modules/.prisma/client2';
// const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_HOST || 'mysql://root:password@localhost:3306/coffect'
    }
  }
});
const mongo = new mongoPrisma({
  datasources: {
    db: {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/coffect'
    }
  }
});

// async function testConnection() {
//   try {
//     const result = await prisma.$queryRaw`SELECT 1`; // 또는 간단한 모델에서 조회
//     console.log('✅ Prisma 연결 성공:', result);
//   } catch (err) {
//     console.error('❌ Prisma 연결 실패:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// (async () => {
//   await testConnection();
// })();
// connection test code

export { prisma, mongo };
