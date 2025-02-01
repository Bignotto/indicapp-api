import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository'
import { UpdateUserPhoneUseCase } from '../updateUserPhoneUseCase'

export function makeUpdateUserPhoneUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const updateUserPhoneUseCase = new UpdateUserPhoneUseCase(usersRepository)

  return updateUserPhoneUseCase
}
