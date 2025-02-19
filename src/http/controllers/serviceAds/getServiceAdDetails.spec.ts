import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Service Ad Details (e2e)', () => {
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

  it('should be able to get service ad details', async () => {
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

    const createServiceAdResponse = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        title: 'Service Title',
        description: 'Service Description',
        value: 100,
        serviceType: typeId,
        serviceSubType: subTypeId,
      })

    const { id } = createServiceAdResponse.body.serviceAd

    const response = await request(app.server)
      .get(`/service-ads/${id}`)
      .set('Authorization', `Bearer ${returnData.token}`)
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
      .set('Authorization', `Bearer ${returnData.token}`)
      .send()

    expect(response.status).toEqual(404)
  })
})
