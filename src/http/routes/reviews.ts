import { FastifyInstance } from 'fastify'
import { createReview } from '../controllers/reviews/createReview'
import { deleteReview } from '../controllers/reviews/deleteReview'
import { updateReview } from '../controllers/reviews/updateReview'
import { verifyJwt } from '../middlewares/verifyJwt'

export async function reviewsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/reviews', createReview)
  app.delete('/reviews/:reviewId', deleteReview)
  app.put('/reviews/:reviewId', updateReview)
}
