import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update Service Ad (e2e)', () => {
  let token: string | undefined

  beforeAll(async () => {
    await app.ready()
    token = await getSupabaseAccessToken(app)
    console.log(token)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should update a service ad', async () => {
    // First create a service ad
    const createResponse = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Original Service',
        description: 'Original Description',
        value: 100,
        serviceType: 1,
        serviceSubType: 1,
      })
    console.log(createResponse.body)

    const serviceAdId = createResponse.body.serviceAd.id

    // TODO: create get service ad route
    const response = await request(app.server)
      .put(`/service-ads/${serviceAdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Service',
        description: 'Updated Description',
        value: 150,
      })

    expect(response.status).toEqual(200)
    expect(response.body.serviceAd).toEqual(
      expect.objectContaining({
        title: 'Updated Service',
        description: 'Updated Description',
        value: 150,
      }),
    )
  })

  it('should not update a service ad with invalid data', async () => {
    const response = await request(app.server)
      .put('/service-ads/invalid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({
        value: -100, // invalid value
      })

    expect(response.status).toEqual(400)
  })
})
