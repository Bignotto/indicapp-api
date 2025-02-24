import { ServiceAdNotFoundError } from '@/global/errors/ServiceAdNotFoundError'
import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { InMemoryReviewsRepository } from '@/repositories/reviews/InMemory/InMemoryReviewsRepository'
import { InMemoryServiceAdsRepository } from '@/repositories/serviceAds/InMemory/InMemoryServiceAdsRepository'
import { InMemoryServiceSubTypesRepository } from '@/repositories/serviceSubTypes/InMemory/InMemoryServiceSubTypesRepository'
import { InMemoryServiceTypesRepository } from '@/repositories/serviceTypes/InMemory/InMemoryServiceTypesRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { ServiceType } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateReviewUseCase } from './createReview'

let usersRepository: InMemoryUsersRepository
let reviewsRepository: InMemoryReviewsRepository
let serviceAdsRepository: InMemoryServiceAdsRepository
let serviceTypesRepository: InMemoryServiceTypesRepository
let serviceSubTypesRepository: InMemoryServiceSubTypesRepository

let type: ServiceType
let subType: ServiceType
let sut: CreateReviewUseCase

describe('Create Review Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    reviewsRepository = new InMemoryReviewsRepository()
    serviceAdsRepository = new InMemoryServiceAdsRepository()
    serviceTypesRepository = new InMemoryServiceTypesRepository()
    serviceSubTypesRepository = new InMemoryServiceSubTypesRepository()
    sut = new CreateReviewUseCase(
      usersRepository,
      reviewsRepository,
      serviceAdsRepository,
    )

    type = await serviceTypesRepository.create({
      name: 'Service Type',
      description: 'Service Type Description',
    })

    subType = await serviceSubTypesRepository.create({
      name: 'Service Sub Type',
      description: 'Service Sub Type Description',
      parentType: {
        connect: {
          id: type.id,
        },
      },
    })
  })

  it('should create a new review', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    })

    const serviceAd = await serviceAdsRepository.create({
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      provider: {
        connect: {
          id: user.id,
        },
      },
      serviceType: {
        connect: {
          id: type.id,
        },
      },
      serviceSubType: {
        connect: {
          id: subType.id,
        },
      },
      serviceClass: 'SERVICE',
      validFrom: new Date(),
      validTo: new Date(),
    })

    const { review } = await sut.execute({
      serviceId: serviceAd.id,
      title: 'Great Service',
      text: 'The service was excellent',
      score: 5,
      reviewerId: user.id,
    })

    expect(review.id).toBeTruthy()
    expect(review.title).toBe('Great Service')
    expect(review.score).toBe(5)
  })

  it('should not create review when user does not exist', async () => {
    const serviceAd = await serviceAdsRepository.create({
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      provider: {
        connect: {
          id: 'Invalid user id',
        },
      },
      serviceType: {
        connect: {
          id: type.id,
        },
      },
      serviceSubType: {
        connect: {
          id: subType.id,
        },
      },
      serviceClass: 'SERVICE',
      validFrom: new Date(),
      validTo: new Date(),
    })

    await expect(() =>
      sut.execute({
        serviceId: serviceAd.id,
        title: 'Great Service',
        text: 'The service was excellent',
        score: 5,
        reviewerId: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not create review when service does not exist', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    })

    await expect(() =>
      sut.execute({
        serviceId: 'non-existing-service',
        title: 'Great Service',
        text: 'The service was excellent',
        score: 5,
        reviewerId: user.id,
      }),
    ).rejects.toBeInstanceOf(ServiceAdNotFoundError)
  })
})
