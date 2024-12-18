import { usersRoutes } from '@/http/controllers/users/routes';
import cors from '@fastify/cors';
import { fastify } from 'fastify';
import { ZodError } from 'zod';
import { env } from './env/config';

export const app = fastify();

// Register CORS
app.register(cors, {
  origin: true, // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

// app.register(fastifyJwt, {
//   secret: env.THE_APP_SECRET,
//   cookie: {
//     cookieName: 'refreshToken',
//     signed: false,
//   },
//   sign: {
//     expiresIn: '10m',
//   },
// })

// app.register(appRoutes)

app.register(usersRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: log unknown error
  }

  return reply.status(500).send({ message: 'Unknown error...' });
});
