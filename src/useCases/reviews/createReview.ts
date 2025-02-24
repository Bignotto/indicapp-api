
import { ServiceAdNotFoundError } from "@/global/errors/ServiceAdNotFoundError"
import { UserNotFoundError } from "@/global/errors/UserNotFoundError"
import { IReviewsRepository } from "@/repositories/reviews/IReviewsRepository"
import { IServiceAdsRepository } from "@/repositories/serviceAds/IServiceAdsRepository"
import { IUsersRepository } from "@/repositories/users/IUsersRepository"
import { Review } from "@prisma/client"

interface CreateReviewRequest {
  serviceId: string
  title: string
  text: string
  score: number
  reviewerId: string
}

interface CreateReviewResponse {
  review: Review
}

export class CreateReviewUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private reviewsRepository: IReviewsRepository,
    private serviceAdsRepository: IServiceAdsRepository,
  ) { }

  async execute({
    serviceId,
    title,
    text,
    score,
    reviewerId,
  }: CreateReviewRequest): Promise<CreateReviewResponse> {
    const reviewer = await this.usersRepository.findById(reviewerId)

    if (!reviewer) {
      throw new UserNotFoundError(reviewerId)
    }

    const service = await this.serviceAdsRepository.findById(serviceId)

    if (!service) {
      throw new ServiceAdNotFoundError(serviceId)
    }

    const review = await this.reviewsRepository.create({
      title,
      text,
      score,
      reviewer: {
        connect: {
          id: reviewer.id,
        },
      },
      providerService: {
        connect: {
          id: service.id,
        },
      },
    })

    return {
      review,
    }
  }
}
