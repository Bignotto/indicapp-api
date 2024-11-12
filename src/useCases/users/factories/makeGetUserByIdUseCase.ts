import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository';
import { GetUserByIdUseCase } from '../getUserByIdUseCase';

export function makeGetUserByIdUseCase() {
  const userRepository = new PrismaUsersRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

  return getUserByIdUseCase;
}
