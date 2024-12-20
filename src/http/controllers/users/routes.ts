import { FastifyInstance } from 'fastify';
import { createNewUser } from './createNewUser';
import { deleteUser } from './deleteUser';
import { getUser } from './getUser';
import { updateUser } from './updateUser';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createNewUser);
  app.get('/users/:id', getUser);
  app.put('/users/:id', updateUser);
  app.delete('/users/:id', deleteUser);
}
