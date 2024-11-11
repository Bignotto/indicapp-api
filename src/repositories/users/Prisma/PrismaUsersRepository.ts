import { prisma } from '@/lib/prisma'
import { $Enums, Prisma, User } from '@prisma/client'
import { IUsersRepository, UpdateUserData } from '../IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {

  async findByEmail(email: string) {
    //TODO: make email unique
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }

  async findById(userId: string) {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return foundUser
  }

  async setUserType(userId: string, userType: $Enums.UserType) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userType,
      },
    })
  }

  async update(userId: string, data: UpdateUserData): Promise<User> {
    throw new Error('Method not implemented.')
  }
  async delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}