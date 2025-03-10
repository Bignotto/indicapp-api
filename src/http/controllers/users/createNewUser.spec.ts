import { app } from '@/app'
import { getSupabaseAccessToken } from '@/utils/tests/mockJWT'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create New User (e2e)', () => {
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

  it('should create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        id: 'fresh new id',
        name: 'John Doe',
        email: 'johndoe@example.com.br',
        phone: '11999999999',
        accountProvider: 'EMAIL',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com.br',
      }),
    )
  })

  it('should not create user with existing email', async () => {
    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        id: 'some other id',
        name: 'John Doe',
        email: 'duplicate@example.com',
        phone: '11999999999',
        accountProvider: 'EMAIL',
      })

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)

      .send({
        id: returnData.userId,
        name: 'John Doe 2',
        email: 'duplicate@example.com',
        phone: '11999999999',
        accountProvider: 'EMAIL',
      })
    expect(response.statusCode).toBe(409)
  })

  it('should not create user with invalid phone number', async () => {
    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        id: 'some other id',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        accountProvider: 'EMAIL',
      })

    expect(response.statusCode).toBe(422)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

  it('should create user with optional fields', async () => {
    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${returnData.token}`)
      .send({
        id: 'new other id',
        name: 'John Doe',
        email: 'johndoe2@example.com',
        phone: '11999999999',
        accountProvider: 'GOOGLE',
        accountId: 'google-123',
        image: 'https://example.com/image.jpg',
        phoneConfirmed: true,
        emailConfirmed: true,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        accountId: 'google-123',
        image: 'https://example.com/image.jpg',
        phoneConfirmed: true,
        emailConfirmed: true,
      }),
    )
  })
})
