import { EmailAlreadyInUseError } from '@/useCases/users/errors/EmailAlreadyInUseError'
import { InvalidPhoneNumberError } from '@/useCases/users/errors/InvalidPhoneNumberError'
import { UserNotFoundError } from '@/useCases/users/errors/UserNotFoundError'
import { makeUpdateUserUseCase } from '@/useCases/users/factories/makeUpdateUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
  })

  const { id } = request.params as { id: string }
  const { name, email, phone, image } = updateUserBodySchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserUseCase()

    const user = await updateUserUseCase.execute({
      userId: id,
      name,
      email,
      phone,
      image,
    })

    return reply.status(200).send({
      user,
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof InvalidPhoneNumberError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
