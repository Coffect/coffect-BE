import { prisma } from '../config/prisma.config';

export class UserModel {
  static async loginModel(userId: string, userPassword: string) {
    const q = await prisma.user.findMany({
      where: {
        id: userId
      }
    });
    if (q) {
      return q[0];
    }
    return null;
  }
}
