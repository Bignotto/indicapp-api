import PrismaReviewsRepository from '@/repositories/reviews/Prisma/PrismaReviewsRepository'
import { PrismaServiceAdsRepository } from '@/repositories/serviceAds/Prisma/PrismaServiceAdsRepository'
import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { CreateReviewUseCase } from '../createReview'

export function makeCreateReviewUseCase() {
  const reviewsRepository = new PrismaReviewsRepository()
  const usersRepository = new PrismaUsersRepository()
  const serviceAdsRepository = new PrismaServiceAdsRepository()

  const useCase = new CreateReviewUseCase(
    usersRepository,
    reviewsRepository,
    serviceAdsRepository,
  )

  return useCase
}
