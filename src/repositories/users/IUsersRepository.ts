import { Prisma, User, UserType } from '@prisma/client';

export interface UpdateUserData {
  name: string
  email: string
  phone: string
  image: string
}

export interface IUsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(userId: string, data: UpdateUserData): Promise<User>
  delete(userId: string): Promise<void>
  setUserType(userId: string, userType: UserType): Promise<void>
}