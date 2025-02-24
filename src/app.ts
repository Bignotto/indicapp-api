import { serviceAdsRoutes } from '@/http/routes/serviceAds'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env/config'
import { reviewsRoutes } from './http/routes/reviews'
import { serviceSubTypesRoutes } from './http/routes/serviceSubTypes'
import { serviceTypesRoutes } from './http/routes/serviceTypes'
import { usersRoutes } from './http/routes/users'

export const app = fastify()

// Register CORS
app.register(cors, {
  origin: true, // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
})

app.register(fastifyJwt, {
  secret: env.THE_APP_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(usersRoutes)
app.register(serviceAdsRoutes)
app.register(serviceTypesRoutes)
app.register(serviceSubTypesRoutes)
app.register(reviewsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    if (env.NODE_ENV !== 'test') console.log(JSON.stringify(error, null, 2))

    return reply
      .status(500)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log unknown error
  }

  return reply.status(500).send({ message: 'Unknown error...' })
})
