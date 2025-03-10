import { prisma } from '@/lib/prisma'
import { $Enums, Prisma, User } from '@prisma/client'
import { IUsersRepository } from '../IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
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

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })

    return user;
  }

  async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
  }

  async findByAccountId(accountId: string) {
    const user = await prisma.user.findFirst({
      where: {
        accountId,
      },
    })

    return user
  }
}
