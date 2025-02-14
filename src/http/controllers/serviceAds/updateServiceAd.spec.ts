import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update Service Ad (e2e)', () => {
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

  it('should update a service ad', async () => {
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

    const createResponse = await request(app.server)
      .post('/service-ads')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        title: 'Original Service',
        description: 'Original Description',
        value: 100,
        serviceType: typeId,
        serviceSubType: subTypeId,
      })

    const serviceAdId = createResponse.body.serviceAd.id

    const response = await request(app.server)
      .put(`/service-ads/${serviceAdId}`)
      .set('Authorization', `Bearer ${returnData.token}`)
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
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        value: -100, // invalid value
      })

    expect(response.status).toEqual(500)
    expect(response.body.message).toEqual('Validation error')
  })
})
