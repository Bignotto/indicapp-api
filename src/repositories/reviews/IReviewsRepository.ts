import { Prisma, Review } from "@prisma/client"

export interface IreviewsRepository {
  create(data: Prisma.ReviewCreateInput): Promise<Review>
  findById(id: number): Promise<Review | null>
  findByReviewerId(reviewerId: string): Promise<Review[]>
  findByServiceAdId(serviceAdId: string): Promise<Review[]>
  update(id: number, data: Prisma.ReviewUpdateInput): Promise<Review>
}