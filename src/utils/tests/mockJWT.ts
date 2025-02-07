import { env } from '@/env/config'
import { supabase } from '@/lib/supabase'

export async function getSupabaseAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: 'dunha@gmail.com',
    password: env.TEST_USER_PASSWORD,
  })

  if (error) {
    throw new Error(`Failed to get access token: ${error.message}`)
  }

  return session?.access_token
}

export function generateMockJWT(payload = {}) {
  const defaultPayload = {
    sub: '123456789',
    role: 'authenticated',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }

  const finalPayload = { ...defaultPayload, ...payload }

  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
  ).toString('base64')
  const body = Buffer.from(JSON.stringify(finalPayload)).toString('base64')
  const signature = env.THE_APP_SECRET

  return `${header}.${body}.${signature}`
}
