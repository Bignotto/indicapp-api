import { ServiceAdNotFoundError } from '@/global/errors/ServiceAdNotFoundError'
import { makeCreateReviewUseCase } from '@/useCases/reviews/factories/makeCreateReviewUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createReviewBodySchema = z.object({
    serviceId: z.string(),
    title: z.string(),
    text: z.string(),
    score: z.number().min(1).max(5),
  })

  const { serviceId, title, text, score } = createReviewBodySchema.parse(
    request.body,
  )

  const createReviewUseCase = makeCreateReviewUseCase()

  try {
    const { review } = await createReviewUseCase.execute({
      serviceId,
      title,
      text,
      score,
      reviewerId: request.user.sub,
    })

    return reply.status(201).send({ review })
  } catch (error) {
    if (error instanceof ServiceAdNotFoundError) {
      return reply.status(404).send({ message: 'service ad not found' })
    }
    console.log('error creating review')
    console.log(JSON.stringify(error, null, 2))

    throw error
  }
}
