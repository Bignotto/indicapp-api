import { config } from 'dotenv'
// import 'dotenv/config';

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  THE_APP_NAME: z.string(),
  THE_APP_SECRET: z.string(),
  THE_APP_VERSION: z.string(),
  PORT: z.coerce.number().default(3333),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  TEST_USER_PASSWORD: z.string(),
})

const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
  console.error('invalid environment variables', _env.error.format())
  throw new Error('invalid environment variables')
}

export const env = _env.data
