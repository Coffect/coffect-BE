import { getChoseong } from 'es-hangul';
import { prisma } from '../config/prisma.config';
import { UnivCertRequest } from '../middleware/univ.DTO/univ.DTO';

export class UnivModel {
  public async selectCertInfo(info: UnivCertRequest) {
    const q = await prisma.univCert.findFirst({
      where: { email: info.email }
    });
    return q;
  }
  public async searchDept(search: string, univName: string) {
    return await prisma.univDept.findMany({
      where: { univ: univName, dept: { contains: search } },
      select: { location: true, univ: true, college: true, dept: true }
    });
  }

  public async searchUnivName(
    univName: string,
    initial: string,
    isInitial: boolean
  ) {
    if (isInitial) {
      const result = await prisma.univList.findMany({
        where: {
          name_initial: { startsWith: initial }
        },
        select: {
          name: true,
          location: true
        }
      });
      return result;
    } else {
      const result = await prisma.univList.findMany({
        where: {
          AND: [
            { name: { startsWith: univName } },
            { name_initial: { startsWith: getChoseong(univName) } }
          ]
        },
        select: {
          name: true,
          location: true
        }
      });
      return result;
    }
  }
}
