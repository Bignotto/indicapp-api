import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository';
import { IUsersRepository } from '@/repositories/users/IUsersRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUseCase } from './createUserUseCase';
import { EmailAlreadyInUseError } from './errors/EmailAlreadyInUseError';
import { InvalidPhoneNumberError } from './errors/InvalidPhoneNumberError';

let usersRepository: IUsersRepository;
let sut: CreateUserUseCase;

describe('User Registration', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it('should be able create new user', async () => {
    const { user } = await sut.execute({
      email: 'user@email.com',
      name: 'John Doe',
      accountProvider: 'EMAIL',
      phone: '12345678901',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to use email address twice', async () => {
    await sut.execute({
      email: 'user@email.com',
      name: 'John Doe',
      accountProvider: 'EMAIL',
      phone: '12345678901',
    });

    await expect(() =>
      sut.execute({
        email: 'user@email.com',
        name: 'John Doe',
        accountProvider: 'EMAIL',
        phone: '12345678901',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('should not be able to register with invalid phone number', async () => {
    await expect(() =>
      sut.execute({
        name: 'Mary Jane',
        email: 'mj@dailyplanet.com',
        phone: 'invalid phone number',
        accountProvider: 'EMAIL',
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneNumberError);
  });
});
