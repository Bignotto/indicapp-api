import { Prisma, ProviderServiceAd } from "@prisma/client"

export interface IServiceAdsRepository {
  create(data: Prisma.ProviderServiceAdCreateInput): Promise<ProviderServiceAd>
  findById(id: string): Promise<ProviderServiceAd | null>
  findByUserId(userId: string): Promise<ProviderServiceAd[]>
  update(id: string, data: Prisma.ProviderServiceAdUpdateInput): Promise<ProviderServiceAd>
  delete(id: string): Promise<void>
}
