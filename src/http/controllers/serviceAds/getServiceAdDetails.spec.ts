import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Service Ad Details (e2e)', () => {
  let token: string | undefined
  beforeAll(async () => {
    await app.ready()
    token = await getSupabaseAccessToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get service ad details', async () => {
    const createServiceAdResponse = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Service Title',
        description: 'Service Description',
        value: 100,
        serviceType: 1,
        serviceSubType: 1,
      })

    const { id } = createServiceAdResponse.body.serviceAd

    const response = await request(app.server)
      .get(`/service-ads/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.serviceAd).toEqual(
      expect.objectContaining({
        title: 'Service Title',
        description: 'Service Description',
        value: 100,
      }),
    )
  })

  it('should not be able to get details of non-existing service ad', async () => {
    const response = await request(app.server)
      .get(`/service-ads/${randomUUID()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(404)
  })
})
