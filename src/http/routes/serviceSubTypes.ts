import { createServiceSubTypeController } from '@/http/controllers/serviceSubTypes/createServiceSubType'
import { getServiceSubTypesByParentId } from '@/http/controllers/serviceSubTypes/getServiceSubTypesByParentId'
import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'

export async function serviceSubTypesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/service-subtypes', createServiceSubTypeController)
  app.get('/service-subtypes/:parentId', getServiceSubTypesByParentId)
}
