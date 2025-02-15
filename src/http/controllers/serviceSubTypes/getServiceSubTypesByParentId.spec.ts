import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Service Sub Types (e2e)', () => {
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

  it('should get service sub types by parent id', async () => {
    // Create a parent service type for testing
    const parentServiceType = await prisma.serviceType.create({
      data: {
        name: 'Test Service Type',
        description: 'Test Description',
      },
    })

    // Create some service sub types
    await prisma.serviceSubType.create({
      data: {
        name: 'Sub Type 1',
        description: 'Sub Type Description 1',
        parentType: {
          connect: {
            id: parentServiceType.id,
          },
        },
      },
    })

    await prisma.serviceSubType.create({
      data: {
        name: 'Sub Type 2',
        description: 'Sub Type Description 2',
        parentType: {
          connect: {
            id: parentServiceType.id,
          },
        },
      },
    })

    const response = await request(app.server)
      .get(`/service-subtypes/${parentServiceType.id}`)
      .set('Authorization', `Bearer ${returnData.token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.serviceSubTypes).toHaveLength(2)
    expect(response.body.serviceSubTypes[0]).toEqual(
      expect.objectContaining({
        name: 'Sub Type 1',
        description: 'Sub Type Description 1',
      }),
    )
  })

  it('should return empty array when no sub types exist', async () => {
    const parentServiceType = await prisma.serviceType.create({
      data: {
        name: 'Empty Service Type',
        description: 'Empty Description',
      },
    })

    const response = await request(app.server)
      .get(`/service-subtypes/${parentServiceType.id}`)
      .set('Authorization', `Bearer ${returnData.token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.serviceSubTypes).toHaveLength(0)
  })
})
