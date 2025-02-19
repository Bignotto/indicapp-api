import { EmailAlreadyInUseError } from '@/useCases/users/errors/EmailAlreadyInUseError'
import { InvalidPhoneNumberError } from '@/useCases/users/errors/InvalidPhoneNumberError'
import { makeCreateNewUserUseCase } from '@/useCases/users/factories/makeCreateUserUseCase'
import { AccountProvider } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserBodySchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    accountProvider: z.nativeEnum(AccountProvider),
    accountId: z.string().optional(),
    image: z.string().optional(),
    phoneConfirmed: z.boolean().optional(),
    emailConfirmed: z.boolean().optional(),
  })

  const {
    id,
    name,
    email,
    phone,
    accountProvider,
    accountId,
    image,
    phoneConfirmed,
    emailConfirmed,
  } = createUserBodySchema.parse(request.body)

  try {
    const createUserUseCase = makeCreateNewUserUseCase()
    const user = await createUserUseCase.execute({
      id,
      name,
      email,
      phone,
      accountProvider,
      accountId,
      image,
      phoneConfirmed,
      emailConfirmed,
    })
    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof InvalidPhoneNumberError) {
      return reply.status(422).send({ message: error.message })
    }

    throw error
  }
}
