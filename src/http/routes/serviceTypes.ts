import { createServiceTypeController } from '@/http/controllers/serviceTypes/createServiceType'
import { getServiceTypes } from '@/http/controllers/serviceTypes/getServiceTypes'
import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'

export async function serviceTypesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/service-types', createServiceTypeController)
  app.get('/service-types', getServiceTypes)
}
