import { makeGetServiceTypesUseCase } from '@/useCases/serviceTypes/factories/makeGetServiceTypesUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getServiceTypes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getServiceTypesUseCase = makeGetServiceTypesUseCase()

  const { serviceTypes } = await getServiceTypesUseCase.execute()

  return reply.status(200).send({
    serviceTypes,
  })
}
