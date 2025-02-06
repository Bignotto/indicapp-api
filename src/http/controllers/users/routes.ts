import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createNewUser } from './createNewUser'
import { deleteUser } from './deleteUser'
import { getUser } from './getUser'
import { getUserByEmail } from './getUserByEmail'
import { updateUser } from './updateUser'
import { updateUserPhone } from './updateUserPhone'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/users', createNewUser)
  app.get('/users/:id', getUser)
  app.put('/users/:id', updateUser)
  app.delete('/users/:id', deleteUser)
  app.get('/users/email/:email', getUserByEmail)
  app.patch('/users/:id/phone', updateUserPhone)
}
