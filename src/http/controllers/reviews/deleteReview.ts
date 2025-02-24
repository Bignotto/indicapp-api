import { NotAuthorizedError } from '@/global/errors/NotAuthorizedError'
import { ReviewNotFoundError } from '@/global/errors/ReviewNotFoundError'
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

  try {
    const deleteReviewUseCase = makeDeleteReviewUseCase()

    await deleteReviewUseCase.execute({
      reviewId,
      userId,
    })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof NotAuthorizedError) {
      return reply.status(401).send({ message: error.message })
    }
  }
}
