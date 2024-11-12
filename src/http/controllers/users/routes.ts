import { FastifyInstance } from 'fastify';
import { createNewUser } from './createNewUser';
import { getUser } from './getUser';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', createNewUser);
  app.get('/users/:id', getUser);
}
