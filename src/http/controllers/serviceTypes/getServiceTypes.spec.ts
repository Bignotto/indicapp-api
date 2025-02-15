import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Service Types (e2e)', () => {
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

  it('should get all service types', async () => {
    await prisma.serviceType.create({
      data: {
        name: 'Service Type 1',
        description: 'Description 1',
      },
    })

    await prisma.serviceType.create({
      data: {
        name: 'Service Type 2',
        description: 'Description 2',
      },
    })

    const response = await request(app.server)
      .get('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.serviceTypes).toHaveLength(2)
    expect(response.body.serviceTypes).toEqual([
      expect.objectContaining({
        name: 'Service Type 1',
        description: 'Description 1',
      }),
      expect.objectContaining({
        name: 'Service Type 2',
        description: 'Description 2',
      }),
    ])
  })

  it('should return empty array when no service types exist', async () => {
    await prisma.serviceType.deleteMany()

    const response = await request(app.server)
      .get('/service-types')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.serviceTypes).toHaveLength(0)
  })
})
