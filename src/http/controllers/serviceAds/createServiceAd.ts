import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { makeCreateServiceAdUseCase } from '@/useCases/serviceAds/factories/makeCreateServiceAdUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createServiceAd(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createServiceAdBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    value: z.number().positive(),
  })

  const { title, description, value } = createServiceAdBodySchema.parse(
    request.body,
  )

  try {
    const createServiceAdUseCase = makeCreateServiceAdUseCase()

    const { serviceAd } = await createServiceAdUseCase.execute({
      providerId: request.user.sub,
      title,
      description,
      value,
    })

    return reply.status(201).send({
      serviceAd,
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
