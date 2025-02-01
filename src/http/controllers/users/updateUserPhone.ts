import { InvalidPhoneNumberError } from '@/useCases/users/errors/InvalidPhoneNumberError'
import { UserNotFoundError } from '@/useCases/users/errors/UserNotFoundError'
import { makeUpdateUserPhoneUseCase } from '@/useCases/users/factories/makeUpdateUserPhoneUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateUserPhone(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserPhoneParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateUserPhoneBodySchema = z.object({
    phone: z.string(),
    confirmed: z.boolean().optional(),
  })

  const { id } = updateUserPhoneParamsSchema.parse(request.params)
  const { phone, confirmed } = updateUserPhoneBodySchema.parse(request.body)

  try {
    const updateUserPhoneUseCase = makeUpdateUserPhoneUseCase()

    const user = await updateUserPhoneUseCase.execute({
      userId: id,
      phone,
      confirmed,
    })

    return reply.status(200).send(user)
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof InvalidPhoneNumberError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
