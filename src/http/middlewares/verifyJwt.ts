import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.headers.authorization) {
      throw new Error('Missing authorization header')
    }

    const payload = await request.jwtVerify()

    // NEXT: FIX user creation to use id from supabase instead of creating new
    // Add user info from JWT payload to request object
    request.user = {
      sub: payload.sub, //eslint-disable-line
    }
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
