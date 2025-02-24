import { NotAuthorizedError } from '@/global/errors/NotAuthorizedError'
import { ReviewNotFoundError } from '@/global/errors/ReviewNotFoundError'
import { makeUpdateReviewUseCase } from '@/useCases/reviews/factories/makeUpdateReviewUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateReviewParamsSchema = z.object({
    reviewId: z.coerce.number(),
  })

  const updateReviewBodySchema = z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    score: z.number().min(1).max(5).optional(),
  })

  const { reviewId } = updateReviewParamsSchema.parse(request.params)
  const { title, text, score } = updateReviewBodySchema.parse(request.body)

  try {
    const updateReviewUseCase = makeUpdateReviewUseCase()

    const { review } = await updateReviewUseCase.execute({
      reviewId,
      userId: request.user.sub,
      title,
      text,
      score,
    })

    return reply.status(200).send({
      review,
    })
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof NotAuthorizedError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
