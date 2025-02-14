import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get User', () => {
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

  it('should be able to get user', async () => {
    const user = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '12345678901',
        accountProvider: 'GOOGLE',
      })

    const response = await request(app.server)
      .get(`/users/${user.body.user.id}`)
      .set('Authorization', `Bearer ${returnData.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '12345678901',
      }),
    )
  })
})
