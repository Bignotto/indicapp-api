import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Service Sub Type (e2e)', () => {
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

  it('should create a service sub type', async () => {
    // First create a parent service type
    const createServiceTypeResponse = await request(app.server)
      .post('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Parent Service Type',
        description: 'Parent service type description',
      })

    const parentTypeId = createServiceTypeResponse.body.serviceType.id

    const response = await request(app.server)
      .post('/service-subtypes')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Test Service Sub Type',
        description: 'Test service sub type description',
        parentServiceTypeId: parentTypeId,
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.serviceSubType).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'Test Service Sub Type',
        description: 'Test service sub type description',
        parentTypeId,
      }),
    )
  })

  it('should not create a service sub type when user is not authenticated', async () => {
    const response = await request(app.server).post('/service-subtypes').send({
      name: 'Test Service Sub Type',
      description: 'Test service sub type description',
      parentServiceTypeId: 1,
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should not create a service sub type with non-existing parent type', async () => {
    const response = await request(app.server)
      .post('/service-subtypes')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Test Service Sub Type',
        description: 'Test service sub type description',
        parentServiceTypeId: 999999,
      })

    expect(response.statusCode).toEqual(404)
  })
})
