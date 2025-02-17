import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PrismaReviewsRepository {
  async getAllReviews() {
    return await prisma.review.findMany();
  }

  async getReviewById(id: number) {
    return await prisma.review.findUnique({
      where: { id },
    });
  }

  async createReview(data: { content: string; rating: number; userId: number; productId: number }) {
    return await prisma.review.create({
      data,
    });
  }

  async updateReview(id: number, data: { content?: string; rating?: number }) {
    return await prisma.review.update({
      where: { id },
      data,
    });
  }

  async deleteReview(id: number) {
    return await prisma.review.delete({
      where: { id },
    });
  }
}

export default PrismaReviewsRepository;