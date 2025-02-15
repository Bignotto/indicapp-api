import { prisma } from '@/lib/prisma'
import { Prisma, ProviderServiceAd } from '@prisma/client'
import { IServiceAdsRepository } from '../IServiceAdsRepository'

export class PrismaServiceAdsRepository implements IServiceAdsRepository {
  async create(data: Prisma.ProviderServiceAdCreateInput): Promise<ProviderServiceAd> {
    const serviceAd = await prisma.providerServiceAd.create({ data })
    return serviceAd
  }

  async findById(id: string): Promise<ProviderServiceAd | null> {
    const serviceAd = await prisma.providerServiceAd.findUnique({
      where: { id },
    })
    return serviceAd
  }

  async findByUserId(userId: string): Promise<ProviderServiceAd[]> {
    const serviceAds = await prisma.providerServiceAd.findMany({
      where: { providerId: userId },
    })
    return serviceAds
  }

  async update(id: string, data: Prisma.ProviderServiceAdUpdateInput): Promise<ProviderServiceAd> {
    const serviceAd = await prisma.providerServiceAd.update({
      where: { id },
      data,
    })
    return serviceAd
  }

  async delete(id: string): Promise<void> {
    await prisma.providerServiceAd.delete({
      where: { id },
    })
  }
}