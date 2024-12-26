import { UserNotFoundError } from '@/useCases/users/errors/UserNotFoundError';
import { makeGetUserByEmailUseCase } from '@/useCases/users/factories/makeGetUserByEmailUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getUserByEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserByEmailQuerySchema = z.object({
    email: z.string().email(),
  });

  const { email } = getUserByEmailQuerySchema.parse(request.params);

  try {
    const getUserByEmailUseCase = makeGetUserByEmailUseCase();

    const user = await getUserByEmailUseCase.execute(email);

    return reply.status(200).send({
      user,
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
