import { FastifyInstance } from 'fastify'
import { createServiceAd } from '../controllers/serviceAds/createServiceAd'
import { verifyJwt } from '../middlewares/verifyJwt'

export async function serviceAdsRoutes(app: FastifyInstance) {
  app.post('/service-ads', { onRequest: [verifyJwt] }, createServiceAd)
}
