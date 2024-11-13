import { UserNotFoundError } from '@/useCases/users/errors/UserNotFoundError';
import { makeDeleteUserUseCase } from '@/useCases/users/factories/makeDeleteUserUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const deleteUserUseCase = makeDeleteUserUseCase();

    await deleteUserUseCase.execute(id);

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
