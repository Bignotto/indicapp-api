import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository';
import { GetUserByEmailUseCase } from '../getUserByEmailUseCase';

export function makeGetUserByEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository);

  return getUserByEmailUseCase;
}
