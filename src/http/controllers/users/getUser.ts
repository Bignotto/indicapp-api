import { UserNotFoundError } from '@/useCases/users/errors/UserNotFoundError';
import { makeGetUserByIdUseCase } from '@/useCases/users/factories/makeGetUserByIdUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const getUserParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = getUserParamsSchema.parse(request.params);

  try {
    const getUserByIdUseCase = makeGetUserByIdUseCase();
    const user = await getUserByIdUseCase.execute(id);
    return reply.status(200).send({ user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
