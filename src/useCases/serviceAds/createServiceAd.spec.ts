import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { InMemoryServiceAdsRepository } from '@/repositories/serviceAds/InMemory/InMemoryServiceAdsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateServiceAdUseCase } from './createServiceAd'

let usersRepository: InMemoryUsersRepository
let serviceAdsRepository: InMemoryServiceAdsRepository
let sut: CreateServiceAdUseCase

describe('Create Service Ad Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    serviceAdsRepository = new InMemoryServiceAdsRepository()
    sut = new CreateServiceAdUseCase(usersRepository, serviceAdsRepository)
  })

  it('should create a new service ad', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      accountId: 'account-1',
      accountProvider: 'GOOGLE',
    })

    const { serviceAd } = await sut.execute({
      providerId: user.id,
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      serviceType: 1,
      serviceSubType: 1,
    })

    expect(serviceAd.id).toBeTruthy()
    expect(serviceAd.title).toBe('Service Title')
    expect(serviceAd.providerId).toBe(user.id)
  })

  it('should not create a service ad with non-existing user', async () => {
    await expect(() =>
      sut.execute({
        providerId: 'non-existing-id',
        title: 'Service Title',
        description: 'Service Description',
        value: 100,
        serviceType: 1,
        serviceSubType: 1,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should store service ad in repository', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      accountId: 'account-1',
      accountProvider: 'GOOGLE',
    })

    const { serviceAd } = await sut.execute({
      providerId: user.id,
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      serviceType: 1,
      serviceSubType: 1,
    })

    const storedServiceAd = await serviceAdsRepository.findById(serviceAd.id)
    expect(storedServiceAd).toBeTruthy()
    expect(storedServiceAd?.title).toBe('Service Title')
  })
})
