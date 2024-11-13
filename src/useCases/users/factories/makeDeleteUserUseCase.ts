import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository';
import { DeleteUserUseCase } from '../deleteUserUseCase';

export function makeGetUserByIdUseCase() {
  const userRepository = new PrismaUsersRepository();
  const getUserByIdUseCase = new DeleteUserUseCase(userRepository);

  return getUserByIdUseCase;
}
