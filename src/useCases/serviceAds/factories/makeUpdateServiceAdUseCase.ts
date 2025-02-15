import { PrismaServiceAdsRepository } from '@/repositories/serviceAds/Prisma/PrismaServiceAdsRepository'
import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { UpdateServiceAdUseCase } from '../updateServiceAd'

export function makeUpdateServiceAdUseCase() {
  const serviceAdsRepository = new PrismaServiceAdsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new UpdateServiceAdUseCase(
    usersRepository,
    serviceAdsRepository,
  )

  return useCase
}
