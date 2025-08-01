import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = pkg;

const prisma = new PrismaClient({});

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

export { prisma };
