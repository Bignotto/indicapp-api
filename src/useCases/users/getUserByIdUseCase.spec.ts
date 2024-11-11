import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserNotFoundError } from './errors/UserNotFoundError';
import { GetUserByIdUseCase } from './getUserByIdUseCase';

describe('Get User By Id Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetUserByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserByIdUseCase(usersRepository);
  });

  it('should return user when id exists', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      accountProvider: 'EMAIL',
    });

    const user = await sut.execute(createdUser.id);

    expect(user).toBeTruthy();
    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('john@example.com');
    expect(user.phone).toEqual('+12345678901');
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(() => sut.execute(nonExistentId)).rejects.toThrow(
      UserNotFoundError,
    );
  });
});
