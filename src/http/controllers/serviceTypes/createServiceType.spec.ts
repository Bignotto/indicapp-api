import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Service Type (e2e)', () => {
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

  it('should create a service type', async () => {
    const response = await request(app.server)
      .post('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'Test Service Type',
        description: 'Test service type description',
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.serviceType).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'Test Service Type',
        description: 'Test service type description',
      }),
    )
  })

  it('should not create a service type when user is not authenticated', async () => {
    const response = await request(app.server).post('/service-types').send({
      name: 'Test Service Type',
      description: 'Test service type description',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should not create a service type with invalid data', async () => {
    const response = await request(app.server)
      .post('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: '',
        description: '',
      })

    expect(response.statusCode).toEqual(500)
    expect(response.body.message).toEqual('Validation error')
  })
})
