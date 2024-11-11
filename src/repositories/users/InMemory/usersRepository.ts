import { Prisma, User, UserType } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { IUsersRepository, UpdateUserData } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      accountProvider: data.accountProvider!,
      accountId: '',
      createdAt: new Date(),
      emailConfirmed: false,
      emailVerified: null,
      image: '',
      phoneConfirmed: false,
      providerScore: 0,
      updatedAt: new Date(),
      userType: 'USER'

    }

    this.items.push(user)

    return user
  }

  async setUserType(userId: string, userType: UserType) {
    const userIndex = this.items.findIndex((item) => item.id === userId)
    this.items[userIndex].userType = userType
  }

  async delete(userId: string): Promise<void> {
    const filteredArray = this.items.filter((item) => item.id !== userId)
    this.items = filteredArray
  }


  async update(userId: string, data: UpdateUserData): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === userId)

    if (userIndex >= 0) {
      this.items[userIndex] = {
        ...this.items[userIndex],
        ...data,
        updatedAt: new Date()
      }

      return this.items[userIndex]
    }

    throw new Error('User not found')
  }
}