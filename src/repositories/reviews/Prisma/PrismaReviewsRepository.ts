import { Prisma, PrismaClient, Review } from '@prisma/client';
import { IReviewsRepository } from '../IReviewsRepository';

const prisma = new PrismaClient();

class PrismaReviewsRepository implements IReviewsRepository {
  create(data: Prisma.ReviewCreateInput): Promise<Review> {
    const review = prisma.review.create({
      data,
    });
    return review;
  }

  findById(id: number): Promise<Review | null> {
    const review = prisma.review.findUnique({
      where: { id },
    });
    return review;
  }

  findByReviewerId(reviewerId: string): Promise<Review[]> {
    const reviews = prisma.review.findMany({
      where: { reviewerId },
    });
    return reviews;
  }

  findByServiceAdId(serviceAdId: string): Promise<Review[]> {
    const reviews = prisma.review.findMany({
      where: { providerServiceId: serviceAdId },
    });
    return reviews;
  }

  update(id: number, data: Prisma.ReviewUpdateInput): Promise<Review> {
    const review = prisma.review.update({
      where: { id },
      data,
    });
    return review;
  }

  async getReviewById(id: number) {
    return await prisma.review.findUnique({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.review.delete({
      where: { id },
    })
  }
}

export default PrismaReviewsRepository;


