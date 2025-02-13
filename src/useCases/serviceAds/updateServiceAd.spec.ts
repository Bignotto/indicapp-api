import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { InMemoryServiceAdsRepository } from '@/repositories/serviceAds/InMemory/InMemoryServiceAdsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateServiceAdUseCase } from './updateServiceAd'

let usersRepository: InMemoryUsersRepository
let serviceAdsRepository: InMemoryServiceAdsRepository
let sut: UpdateServiceAdUseCase

describe('Update Service Ad Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    serviceAdsRepository = new InMemoryServiceAdsRepository()
    sut = new UpdateServiceAdUseCase(usersRepository, serviceAdsRepository)
  })

  it('should update a service ad', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      accountProvider: 'GOOGLE',
    })

    const serviceAd = await serviceAdsRepository.create({
      title: 'Original Title',
      description: 'Original Description',
      value: 100,
      provider: { connect: { id: user.id } },
      validFrom: new Date(),
      validTo: new Date(),
      serviceType: { connect: { id: 1 } },
      serviceSubType: { connect: { id: 1 } },
    })

    const { serviceAd: updatedAd } = await sut.execute({
      serviceAdId: serviceAd.id,
      providerId: user.id,
      title: 'Updated Title',
      description: 'Updated Description',
      value: 150,
    })

    expect(updatedAd.title).toEqual('Updated Title')
    expect(updatedAd.description).toEqual('Updated Description')
    expect(updatedAd.value).toEqual(150)
  })

  it('should not update a service ad with non-existing user', async () => {
    await expect(() =>
      sut.execute({
        serviceAdId: 'service-id',
        providerId: 'non-existing-id',
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
