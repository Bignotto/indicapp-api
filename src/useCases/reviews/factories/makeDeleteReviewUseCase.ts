import PrismaReviewsRepository from '@/repositories/reviews/Prisma/PrismaReviewsRepository'
import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { DeleteReviewUseCase } from '../deleteReview'

export function makeDeleteReviewUseCase() {
  const reviewsRepository = new PrismaReviewsRepository()
  const usersRepository = new PrismaUsersRepository()
  const deleteReviewUseCase = new DeleteReviewUseCase(
    reviewsRepository,
    usersRepository,
  )

  return deleteReviewUseCase
}
