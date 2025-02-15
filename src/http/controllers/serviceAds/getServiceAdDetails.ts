import { ServiceAdNotFoundError } from '@/global/errors/ServiceAdNotFoundError'
import { makeGetServiceAdDetailsUseCase } from '@/useCases/serviceAds/factories/makeGetServiceAdDetailsUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getServiceAdDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getServiceAdDetailsParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getServiceAdDetailsParamsSchema.parse(request.params)

  try {
    const getServiceAdDetailsUseCase = makeGetServiceAdDetailsUseCase()
    const { serviceAd } = await getServiceAdDetailsUseCase.execute(id)

    return reply.status(200).send({
      serviceAd,
    })
  } catch (error) {
    if (error instanceof ServiceAdNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
