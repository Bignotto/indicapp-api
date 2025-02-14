import { makeCreateServiceTypeUseCase } from '@/useCases/serviceTypes/factories/makeCreateServiceTypeUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createServiceTypeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createServiceTypeBodySchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
  })

  const { name, description } = createServiceTypeBodySchema.parse(request.body)

  const createServiceTypeUseCase = makeCreateServiceTypeUseCase()

  const { serviceType } = await createServiceTypeUseCase.execute({
    name,
    description,
  })

  return reply.status(201).send({
    serviceType,
  })
}
