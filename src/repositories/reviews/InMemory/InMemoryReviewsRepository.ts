import { Prisma, Review } from "@prisma/client";
import { IreviewsRepository } from "../IReviewsRepository";

export class InMemoryReviewsRepository implements IreviewsRepository {
  public items: Review[] = []

  async create(data: Prisma.ReviewCreateInput): Promise<Review> {

    const review: Review = {
      id: 1,
      reviewerId: data.reviewer.connect?.id ?? '',
      providerServiceId: data.providerService.connect?.id ?? '',
      score: data.score,
      title: data.title,
      text: data.text,
      reviewDate: new Date(),

    }
    this.items.push(review)
    return review
  }

  async findById(id: number): Promise<Review | null> {
    const review = this.items.find(item => item.id === id)
    if (!review) return null
    return review
  }

  async findByReviewerId(reviewerId: string): Promise<Review[]> {
    const reviews = this.items.filter(item => item.reviewerId === reviewerId)
    return reviews
  }

  async findByServiceAdId(serviceAdId: string): Promise<Review[]> {
    const reviews = this.items.filter(item => item.providerServiceId === serviceAdId)
    return reviews
  }

  async update(id: number, data: Prisma.ReviewUpdateInput): Promise<Review> {
    const reviewIndex = this.items.findIndex(item => item.id === id)
    if (reviewIndex >= 0) {
      const review = this.items[reviewIndex]
      this.items[reviewIndex] = {
        ...review,
        score: data.score as number ?? review.score,
        title: data.title as string ?? review.title,
        text: data.text as string ?? review.text,
      }
      return this.items[reviewIndex]
    }
    throw new Error('Review not found')

  }

}