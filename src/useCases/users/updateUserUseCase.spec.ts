import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidPhoneNumberError } from './errors/InvalidPhoneNumberError';
import { UserNotFoundError } from './errors/UserNotFoundError';
import { UpdateUserUseCase } from './updateUserUseCase';

describe('Update User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: UpdateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserUseCase(usersRepository);
  });

  it('should update user information', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      accountProvider: 'EMAIL',
    });

    const updatedUser = await sut.execute({
      userId: user.id,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+12345678902',
      image: 'new-image-url',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('jane@example.com');
    expect(updatedUser.phone).toBe('12345678902');
    expect(updatedUser.image).toBe('new-image-url');
  });

  it('should throw error when user is not found', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
        name: 'Jane Doe',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('should throw error when phone number is invalid', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      accountProvider: 'EMAIL',
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        phone: 'invalid-phone',
      }),
    ).rejects.toThrow(InvalidPhoneNumberError);
  });

  it('should update only provided fields', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      accountProvider: 'EMAIL',
    });

    const updatedUser = await sut.execute({
      userId: user.id,
      name: 'Jane Doe',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('john@example.com');
    expect(updatedUser.phone).toBe('+12345678901');
  });
});
