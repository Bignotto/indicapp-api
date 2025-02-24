import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import { ProviderServiceAd } from '@prisma/client'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update Review (e2e)', () => {
  let accessData: {
    token: string
    userId: string
  }

  let serviceAd1: ProviderServiceAd

  beforeAll(async () => {
    await app.ready()
    accessData = await getSupabaseAccessToken(app)

    const typeResponse = await request(app.server)
      .post('/service-types')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        name: 'Service Title',
        description: 'Service Description',
      })

    const { id: typeId } = typeResponse.body.serviceType

    const subTypeResponse = await request(app.server)
      .post('/service-subtypes')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        name: 'Service Title',
        description: 'Service Description',
        parentServiceTypeId: typeId,
      })

    const { id: subTypeId } = subTypeResponse.body.serviceSubType

    const response = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        title: 'Test Service Ad',
        description: 'This is a test service ad',
        value: 100,
        serviceType: typeId,
        serviceSubType: subTypeId,
      })
    serviceAd1 = response.body.serviceAd
  })

  afterAll(async () => {
    await app.close()
  })

  it('should update a review', async () => {
    const review = await prisma.review.create({
      data: {
        title: 'Original Review',
        text: 'Original Text',
        score: 3,
        reviewerId: accessData.userId,
        providerServiceId: serviceAd1.id,
      },
    })

    const response = await request(app.server)
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        title: 'Updated Review',
        text: 'Updated Text',
        score: 5,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.review).toEqual(
      expect.objectContaining({
        title: 'Updated Review',
        text: 'Updated Text',
        score: 5,
      }),
    )
  })

  it('should not update review from another user', async () => {
    const otherUser = await prisma.user.create({
      data: {
        id: 'other-user-id',
        name: 'Other User',
        email: 'other@example.com',
        phone: '11999999999',
        accountProvider: 'EMAIL',
      },
    })

    const review = await prisma.review.create({
      data: {
        title: 'Test Review',
        text: 'Test Review Text',
        score: 5,
        reviewerId: otherUser.id,
        providerServiceId: serviceAd1.id,
      },
    })

    const response = await request(app.server)
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        title: 'Updated Review',
      })

    expect(response.statusCode).toBe(401)
  })

  it('should validate review score range', async () => {
    const review = await prisma.review.create({
      data: {
        title: 'Test Review',
        text: 'Test Review Text',
        score: 5,
        reviewerId: accessData.userId,
        providerServiceId: serviceAd1.id,
      },
    })

    const response = await request(app.server)
      .put(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        score: 6,
      })
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })
})
