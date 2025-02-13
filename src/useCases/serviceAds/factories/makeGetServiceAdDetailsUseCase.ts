import { PrismaServiceAdsRepository } from '@/repositories/serviceAds/Prisma/PrismaServiceAdsRepository'
import { GetServiceAdDetailsUseCase } from '../getServiceAdDetails'

export function makeGetServiceAdDetailsUseCase() {
  const serviceAdsRepository = new PrismaServiceAdsRepository()
  const getServiceAdDetailsUseCase = new GetServiceAdDetailsUseCase(
    serviceAdsRepository,
  )

  return getServiceAdDetailsUseCase
}
