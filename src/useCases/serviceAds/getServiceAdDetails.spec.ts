import { ServiceAdNotFoundError } from '@/global/errors/ServiceAdNotFoundError'
import { InMemoryServiceAdsRepository } from '@/repositories/serviceAds/InMemory/InMemoryServiceAdsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateServiceAdUseCase } from './createServiceAd'
import { GetServiceAdDetailsUseCase } from './getServiceAdDetails'

let serviceAdsRepository: InMemoryServiceAdsRepository
let usersRepository: InMemoryUsersRepository
let createServiceAdUseCase: CreateServiceAdUseCase
let sut: GetServiceAdDetailsUseCase

describe('Get Service Ad Details Use Case', () => {
  beforeEach(() => {
    serviceAdsRepository = new InMemoryServiceAdsRepository()
    usersRepository = new InMemoryUsersRepository()
    createServiceAdUseCase = new CreateServiceAdUseCase(
      usersRepository,
      serviceAdsRepository,
    )
    sut = new GetServiceAdDetailsUseCase(serviceAdsRepository)
  })

  it('should be able to get service ad details', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '12345678901',
      accountProvider: 'GOOGLE',
    })

    const { serviceAd: createdAd } = await createServiceAdUseCase.execute({
      providerId: user.id,
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      serviceType: 1,
      serviceSubType: 1,
    })

    const { serviceAd } = await sut.execute(createdAd.id)

    expect(serviceAd.id).toEqual(createdAd.id)
    expect(serviceAd.title).toEqual('Service Title')
    expect(serviceAd.description).toEqual('Service Description')
    expect(serviceAd.value).toEqual(100)
  })

  it('should not be able to get details of non-existing service ad', async () => {
    await expect(() => sut.execute(randomUUID())).rejects.toBeInstanceOf(
      ServiceAdNotFoundError,
    )
  })
})
