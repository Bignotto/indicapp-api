import { makeGetServiceSubTypesByParentIdUseCase } from '@/useCases/serviceSubTypes/factories/makeGetServiceSubTypesByParentIdUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getServiceSubTypesByParentId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getServiceSubTypesByParentIdParamsSchema = z.object({
    parentId: z.string(),
  })

  const { parentId } = getServiceSubTypesByParentIdParamsSchema.parse(
    request.params,
  )

  const getServiceSubTypesByParentIdUseCase =
    makeGetServiceSubTypesByParentIdUseCase()

  const { serviceSubTypes } = await getServiceSubTypesByParentIdUseCase.execute(
    {
      parentId: parseInt(parentId),
    },
  )

  return reply.status(200).send({
    serviceSubTypes,
  })
}
