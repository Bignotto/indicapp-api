import { NotAuthorizedError } from "@/global/errors/NotAuthorizedError"
import { ReviewNotFoundError } from "@/global/errors/ReviewNotFoundError"
import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IReviewsRepository } from "@/repositories/reviews/IReviewsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { Review } from "@prisma/client"

interface UpdateReviewRequest {
  reviewId: number
  userId: string
  title?: string
  text?: string
  score?: number
}

interface UpdateReviewResponse {
  review: Review
}

export class UpdateReviewUseCase {
  constructor(
    private reviewsRepository: IReviewsRepository,
    private usersRepository: IUsersRepository,
  ) { }

  async execute({
    reviewId,
    userId,
    title,
    text,
    score
  }: UpdateReviewRequest): Promise<UpdateReviewResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    const review = await this.reviewsRepository.findById(reviewId)

    if (!review) {
      throw new ReviewNotFoundError(reviewId.toString())
    }

    if (review.reviewerId !== userId) {
      throw new NotAuthorizedError()
    }

    const updatedReview = await this.reviewsRepository.update(reviewId, {
      title,
      text,
      score,
    })

    return {
      review: updatedReview
    }
  }
}
