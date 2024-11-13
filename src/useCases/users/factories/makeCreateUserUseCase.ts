import { PrismaUsersRepository } from '@/repositories/users/Prisma/PrismaUsersRepository';
import { CreateUserUseCase } from '../createUserUseCase';

export function makeCreateNewUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const createNewUserUseCase = new CreateUserUseCase(userRepository);

  return createNewUserUseCase;
}
