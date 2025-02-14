import { ParentServiceTypeNotFound } from '@/useCases/serviceSubTypes/errors/ParentServiceTypeNotFoundError'
import { makeCreateServiceSubTypeUseCase } from '@/useCases/serviceSubTypes/factories/makeCreateServiceSubTypeUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createServiceSubTypeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createServiceSubTypeBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    parentServiceTypeId: z.number(),
  })

  const { name, description, parentServiceTypeId } =
    createServiceSubTypeBodySchema.parse(request.body)

  try {
    const createServiceSubTypeUseCase = makeCreateServiceSubTypeUseCase()

    const { serviceSubType } = await createServiceSubTypeUseCase.execute({
      name,
      description,
      parentServiceTypeId,
    })

    return reply.status(201).send({
      serviceSubType,
    })
  } catch (error) {
    if (error instanceof ParentServiceTypeNotFound) {
      return reply.status(404).send({ message: error.message })
    }
  }
}
