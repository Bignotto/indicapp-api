import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { makeUpdateServiceAdUseCase } from '@/useCases/serviceAds/factories/makeUpdateServiceAdUseCase'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateServiceAd(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateServiceAdParamsSchema = z.object({
    serviceAdId: z.string().uuid(),
  })

  const updateServiceAdBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    value: z.number().positive().optional(),
    validTo: z.string().datetime().optional(),
    serviceType: z.number().positive().optional(),
    serviceSubType: z.number().positive().optional(),
  })

  const { serviceAdId } = updateServiceAdParamsSchema.parse(request.params)
  const { title, description, value, validTo, serviceType, serviceSubType } =
    updateServiceAdBodySchema.parse(request.body)

  try {
    const updateServiceAdUseCase = makeUpdateServiceAdUseCase()

    const { serviceAd } = await updateServiceAdUseCase.execute({
      serviceAdId,
      providerId: request.user.sub,
      title,
      description,
      value,
      validTo: validTo ? new Date(validTo) : undefined,
      serviceType,
      serviceSubType,
    })

    return reply.status(200).send({
      serviceAd,
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return reply
          .status(404)
          .send({ message: 'Service type or service sub type not found' })
      }
    }

    throw error
  }
}
