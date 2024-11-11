import { EmailAlreadyInUseError } from '@/useCases/users/errors/EmailAlreadyInUseError';
import { makeCreateNewUserUseCase } from '@/useCases/users/factories/makeCreateUserUseCase';
import { AccountProvider } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function createNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    accountProvider: z.nativeEnum(AccountProvider),
  });

  const { name, email, phone, accountProvider } = createUserBodySchema.parse(
    request.body,
  );

  try {
    const createUserUseCase = makeCreateNewUserUseCase();
    await createUserUseCase.execute({
      name,
      email,
      phone,
      accountProvider,
    });
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
