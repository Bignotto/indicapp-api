import { PrismaServiceAdsRepository } from '@/repositories/serviceAds/Prisma/PrismaServiceAdsRepository'
import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { CreateServiceAdUseCase } from '../createServiceAd'

export function makeCreateServiceAdUseCase() {
  const serviceAdsRepository = new PrismaServiceAdsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreateServiceAdUseCase(
    usersRepository,
    serviceAdsRepository,
  )

  return useCase
}
