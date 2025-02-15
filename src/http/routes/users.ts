import { FastifyInstance } from 'fastify'
import { createNewUser } from '../controllers/users/createNewUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { getUser } from '../controllers/users/getUser'
import { getUserByEmail } from '../controllers/users/getUserByEmail'
import { updateUser } from '../controllers/users/updateUser'
import { updateUserPhone } from '../controllers/users/updateUserPhone'
import { verifyJwt } from '../middlewares/verifyJwt'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/users', createNewUser)
  app.get('/users/:id', getUser)
  app.put('/users/:id', updateUser)
  app.delete('/users/:id', deleteUser)
  app.get('/users/email/:email', getUserByEmail)
  app.patch('/users/:id/phone', updateUserPhone)
}
