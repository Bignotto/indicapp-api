import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Service Ad (e2e)', () => {
  let returnData: {
    token: string
    userId: string
  }

  beforeAll(async () => {
    await app.ready()
    returnData = await getSupabaseAccessToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a service ad', async () => {
    const typeResponse = await request(app.server)
      .post('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Service Title',
        description: 'Service Description',
      })

    const { id: typeId } = typeResponse.body.serviceType

    const subTypeResponse = await request(app.server)
      .post('/service-subtypes')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Service Title',
        description: 'Service Description',
        parentServiceTypeId: typeId,
      })

    const { id: subTypeId } = subTypeResponse.body.serviceSubType

    const response = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        title: 'Test Service Ad',
        description: 'This is a test service ad',
        value: 100,
        serviceType: typeId,
        serviceSubType: subTypeId,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.serviceAd).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Test Service Ad',
      }),
    )
  })

  it('should not create a service ad when user is not authenticated', async () => {
    const response = await request(app.server).post('/service-ads').send({
      title: 'Test Service Ad',
      description: 'This is a test service ad',
      value: 100,
      serviceTypeId: 1,
      serviceSubTypeId: 1,
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not create a service ad with invalid data', async () => {
    const { token } = await getSupabaseAccessToken(app)

    const response = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // Missing required title
        description: 'This is a test service ad',
        value: -100, // Invalid negative value
        serviceType: 'invalid-type', // Invalid type format
        serviceSubType: null, // Missing subtype
      })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })
})
