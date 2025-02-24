import { NotAuthorizedError } from "@/global/errors/NotAuthorizedError"
import { ReviewNotFoundError } from "@/global/errors/ReviewNotFoundError"
import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IReviewsRepository } from "@/repositories/reviews/IReviewsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"

interface DeleteReviewRequest {
  reviewId: number
  userId: string
}

interface DeleteReviewResponse {
  success: boolean
}

export class DeleteReviewUseCase {
  constructor(
    private reviewsRepository: IReviewsRepository,
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ reviewId, userId }: DeleteReviewRequest): Promise<DeleteReviewResponse> {
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

    await this.reviewsRepository.delete(reviewId)

    return {
      success: true
    }
  }
}
