import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { UserNotFoundError } from './errors/UserNotFoundError';

describe('Delete User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: DeleteUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(usersRepository);
  });

  it('should delete an existing user', async () => {
    // Create a user first
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      accountProvider: 'EMAIL',
    });

    const result = await sut.execute(createdUser.id);

    expect(result.success).toBe(true);
    expect(result.message).toEqual(
      `User ${createdUser.id} successfully deleted`,
    );

    // Verify user was actually deleted
    const deletedUser = await usersRepository.findById(createdUser.id);
    expect(deletedUser).toBeNull();
  });

  it('should throw UserNotFoundError when trying to delete non-existent user', async () => {
    const nonExistentUserId = 'non-existent-id';

    await expect(() => sut.execute(nonExistentUserId)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should throw UserNotFoundError with correct error message', async () => {
    const nonExistentUserId = 'non-existent-id';

    await expect(() => sut.execute(nonExistentUserId)).rejects.toThrow(
      `User with id ${nonExistentUserId} not found`,
    );
  });
});
