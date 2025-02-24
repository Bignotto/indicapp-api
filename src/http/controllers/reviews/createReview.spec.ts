import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import { ProviderServiceAd } from '@prisma/client'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Review (e2e)', () => {
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

  it('should create a review', async () => {
    const response = await request(app.server)
      .post('/reviews')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        serviceId: serviceAd1.id,
        title: 'Great Service',
        text: 'The service was excellent',
        score: 5,
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.review).toEqual(
      expect.objectContaining({
        title: 'Great Service',
        text: 'The service was excellent',
        score: 5,
      }),
    )
  })

  it('should not create a review when service does not exist', async () => {
    const response = await request(app.server)
      .post('/reviews')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        serviceId: 'non-existent-id',
        title: 'Great Service',
        text: 'The service was excellent',
        score: 5,
      })

    expect(response.statusCode).toEqual(404)
  })

  it('should not create a review with invalid score', async () => {
    const response = await request(app.server)
      .post('/reviews')
      .set('Authorization', `Bearer ${accessData.token}`)
      .send({
        serviceId: 'any-id',
        title: 'Great Service',
        text: 'The service was excellent',
        score: 6,
      })

    expect(response.statusCode).toEqual(500)
  })
})
