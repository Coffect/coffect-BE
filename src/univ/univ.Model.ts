import { prisma } from '../config/prisma.config';
import { UnivCertRequest } from '../middleware/univ.DTO/univ.DTO';

export class UnivModel {
  public async selectCertInfo(info: UnivCertRequest) {
    const q = await prisma.univCert.findFirst({
      where: { email: info.email }
    });
    return q;
  }
}
