import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import { ProviderServiceAd } from '@prisma/client'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Delete Review (e2e)', () => {
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

  it('should delete a review', async () => {
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
      .delete(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessData.token}`)
      .send()

    expect(response.statusCode).toBe(200)

    const deletedReview = await prisma.review.findUnique({
      where: {
        id: review.id,
      },
    })

    expect(deletedReview).toBeNull()
  })

  // TODO: complete tests
  it('should not delete review from another user', async () => {
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
      .delete(`/reviews/${review.id}`)
      .set('Authorization', `Bearer ${accessData.token}`)
      .send()

    expect(response.statusCode).toBe(401)
  })

  it('should return 404 when trying to delete non-existing review', async () => {
    const response = await request(app.server)
      .delete('/reviews/999999')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send()

    expect(response.statusCode).toBe(404)
  })
})
