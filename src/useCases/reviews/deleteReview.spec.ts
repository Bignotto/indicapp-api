import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { InMemoryReviewsRepository } from '@/repositories/reviews/InMemory/InMemoryReviewsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotAuthorizedError } from '../../global/errors/NotAuthorizedError'
import { DeleteReviewUseCase } from './deleteReview'

let reviewsRepository: InMemoryReviewsRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteReviewUseCase

describe('Delete Review Use Case', () => {
  beforeEach(() => {
    reviewsRepository = new InMemoryReviewsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteReviewUseCase(reviewsRepository, usersRepository)
  })

  it('should delete a review', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    })

    const review = await reviewsRepository.create({
      reviewer: {
        connect: { id: user.id },
      },
      providerService: {
        connect: { id: 'service-1' },
      },
      score: 5,
      title: 'Great service',
      text: 'Really enjoyed it',
    })

    const { success } = await sut.execute({
      reviewId: review.id,
      userId: user.id,
    })

    expect(success).toBe(true)
    expect(reviewsRepository.items).toHaveLength(0)
  })

  it('should not delete review when user does not exist', async () => {
    await expect(() =>
      sut.execute({
        reviewId: 1,
        userId: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not delete review from another user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    })

    const otherUser = await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    })

    const review = await reviewsRepository.create({
      reviewer: {
        connect: { id: user.id },
      },
      providerService: {
        connect: { id: 'service-1' },
      },
      score: 5,
      title: 'Great service',
      text: 'Really enjoyed it',
    })

    await expect(() =>
      sut.execute({
        reviewId: review.id,
        userId: otherUser.id,
      }),
    ).rejects.toBeInstanceOf(NotAuthorizedError)
  })
})
