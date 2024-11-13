import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository';
import { UpdateUserUseCase } from '../updateUserUseCase';

export function makeUpdateUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const getUserByIdUseCase = new UpdateUserUseCase(userRepository);

  return getUserByIdUseCase;
}
