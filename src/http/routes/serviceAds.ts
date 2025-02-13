import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createServiceAd } from '../controllers/serviceAds/createServiceAd'
import { getServiceAdDetails } from '../controllers/serviceAds/getServiceAdDetails'
import { updateServiceAd } from '../controllers/serviceAds/updateServiceAd'

export async function serviceAdsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/service-ads', createServiceAd)
  app.get('/service-ads/:id', getServiceAdDetails)
  app.put('/service-ads/:id', updateServiceAd)
}
