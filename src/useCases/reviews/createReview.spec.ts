import { InMemoryReviewsRepository } from '@/repositories/reviews/InMemory/InMemoryReviewsRepository'
import { InMemoryServiceAdsRepository } from '@/repositories/serviceAds/InMemory/InMemoryServiceAdsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateReviewUseCase } from './createReview'

let usersRepository: InMemoryUsersRepository
let reviewsRepository: InMemoryReviewsRepository
let serviceAdsRepository: InMemoryServiceAdsRepository
let sut: CreateReviewUseCase

describe('Create Review Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    reviewsRepository = new InMemoryReviewsRepository()
    serviceAdsRepository = new InMemoryServiceAdsRepository()
    sut = new CreateReviewUseCase(
      usersRepository,
      reviewsRepository,
      serviceAdsRepository,
    )
  })

  it('should create a new review', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    })

    // NEXT: Create type and sub type for testing purposes
    const serviceAd = await serviceAdsRepository.create({
      providerId: user.id,
      title: 'Service Title',
      description: 'Service Description',
      value: 100,
      serviceType: 1,
      serviceSubType: 1,
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
          id: randomUUID(),
        },
      },
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
