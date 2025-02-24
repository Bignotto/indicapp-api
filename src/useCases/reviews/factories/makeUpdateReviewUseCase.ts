import PrismaReviewsRepository from '@/repositories/reviews/Prisma/PrismaReviewsRepository'
import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { UpdateReviewUseCase } from '../updateReview'

export function makeUpdateReviewUseCase() {
  const reviewsRepository = new PrismaReviewsRepository()
  const usersRepository = new PrismaUsersRepository()
  const updateReviewUseCase = new UpdateReviewUseCase(
    reviewsRepository,
    usersRepository,
  )

  return updateReviewUseCase
}
