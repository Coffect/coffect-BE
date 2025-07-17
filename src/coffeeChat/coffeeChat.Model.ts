import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export class HomeModel {
  // 하루 관심란 입력
  public async postTodayInterestModel(
    userId: number,
    todayInterest: number
  ): Promise<void> {
    await prisma.user.update({
      where: { userId: userId },
      data: { todayInterest: todayInterest }
    });
  }

  public async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}
