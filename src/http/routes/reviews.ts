import { FastifyInstance } from 'fastify'
import { createReview } from '../controllers/reviews/createReview'
import { verifyJwt } from '../middlewares/verifyJwt'

export async function reviewsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/reviews', createReview)
}
