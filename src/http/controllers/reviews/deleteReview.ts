import { makeDeleteReviewUseCase } from '@/useCases/reviews/factories/makeDeleteReviewUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteReviewParamsSchema = z.object({
    reviewId: z.coerce.number(),
  })

  const { reviewId } = deleteReviewParamsSchema.parse(request.params)
  const userId = request.user.sub

  const deleteReviewUseCase = makeDeleteReviewUseCase()

  await deleteReviewUseCase.execute({
    reviewId,
    userId,
  })

  return reply.status(200).send()
}
