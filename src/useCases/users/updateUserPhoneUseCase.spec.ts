import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidPhoneNumberError } from './errors/InvalidPhoneNumberError'
import { UserNotFoundError } from './errors/UserNotFoundError'
import { UpdateUserPhoneUseCase } from './updateUserPhoneUseCase'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserPhoneUseCase

describe('Update User Phone Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserPhoneUseCase(usersRepository)
  })

  it('should update user phone', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '11999999999',
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      phone: '11988888888',
    })

    expect(updatedUser.phone).toEqual('11988888888')
    expect(updatedUser.phoneConfirmed).toBe(false)
  })

  it('should clean phone number before updating', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '11999999999',
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      phone: '(11) 98888-8888',
    })

    expect(updatedUser.phone).toEqual('11988888888')
  })

  it('should not update phone if user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        phone: '11988888888',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not update phone if number is invalid', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '11999999999',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        phone: '123',
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneNumberError)
  })
})
