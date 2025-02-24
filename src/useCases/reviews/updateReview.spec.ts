import { NotAuthorizedError } from '@/global/errors/NotAuthorizedError'
import { ReviewNotFoundError } from '@/global/errors/ReviewNotFoundError'
import { UserNotFoundError } from '@/global/errors/UserNotFoundError'
import { InMemoryReviewsRepository } from '@/repositories/reviews/InMemory/InMemoryReviewsRepository'
import { InMemoryUsersRepository } from '@/repositories/users/InMemory/usersRepository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateReviewUseCase } from './updateReview'

let reviewsRepository: InMemoryReviewsRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateReviewUseCase

describe('Update Review Use Case', () => {
  beforeEach(() => {
    reviewsRepository = new InMemoryReviewsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateReviewUseCase(reviewsRepository, usersRepository)
  })

  it('should update a review', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    })

    const review = await reviewsRepository.create({
      title: 'Original Title',
      text: 'Original Text',
      score: 4,
      reviewer: {
        connect: { id: user.id },
      },
      providerService: {
        connect: { id: 'service-01' },
      },
    })

    const { review: updatedReview } = await sut.execute({
      reviewId: review.id,
      userId: user.id,
      title: 'Updated Title',
      text: 'Updated Text',
      score: 5,
    })

    expect(updatedReview.title).toBe('Updated Title')
    expect(updatedReview.text).toBe('Updated Text')
    expect(updatedReview.score).toBe(5)
  })

  it('should not update a review from non-existing user', async () => {
    await expect(() =>
      sut.execute({
        reviewId: 1,
        userId: 'non-existing-user',
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not update a non-existing review', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    })

    await expect(() =>
      sut.execute({
        reviewId: 999,
        userId: user.id,
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(ReviewNotFoundError)
  })

  it('should not allow updating review from different user', async () => {
    const reviewer = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    })

    const otherUser = await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
    })

    const review = await reviewsRepository.create({
      title: 'Original Title',
      text: 'Original Text',
      score: 4,
      reviewer: {
        connect: { id: reviewer.id },
      },
      providerService: {
        connect: { id: 'service-01' },
      },
    })

    await expect(() =>
      sut.execute({
        reviewId: review.id,
        userId: otherUser.id,
        title: 'Updated Title',
      }),
    ).rejects.toBeInstanceOf(NotAuthorizedError)
  })

  it('should allow partial updates', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    })

    const review = await reviewsRepository.create({
      title: 'Original Title',
      text: 'Original Text',
      score: 4,
      reviewer: {
        connect: { id: user.id },
      },
      providerService: {
        connect: { id: 'service-01' },
      },
    })

    const { review: updatedReview } = await sut.execute({
      reviewId: review.id,
      userId: user.id,
      title: 'Updated Title',
    })

    expect(updatedReview.title).toBe('Updated Title')
    expect(updatedReview.text).toBe('Original Text')
    expect(updatedReview.score).toBe(4)
  })
})
