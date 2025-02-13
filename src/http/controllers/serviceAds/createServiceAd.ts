import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { makeCreateServiceAdUseCase } from '@/useCases/serviceAds/factories/makeCreateServiceAdUseCase'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
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
    serviceType: z.number().positive(),
    serviceSubType: z.number().positive(),
  })

  const { title, description, value, serviceType, serviceSubType } =
    createServiceAdBodySchema.parse(request.body)

  try {
    const createServiceAdUseCase = makeCreateServiceAdUseCase()

    const { serviceAd } = await createServiceAdUseCase.execute({
      providerId: request.user.sub,
      title,
      description,
      value,
      serviceType,
      serviceSubType,
    })

    return reply.status(201).send({
      serviceAd,
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    // TODO: make customized errors and void using prisma errors iside controllers
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.error({ error: error.code, cause: error.meta?.cause })
        return reply
          .status(404)
          .send({ message: 'Service type or service sub type not found' })
      }
    }

    console.log('error creating service ad')
    console.log(JSON.stringify(error, null, 2))

    throw error
  }
}
