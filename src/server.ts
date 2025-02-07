// server.ts
import { app } from './app'
import { env } from './env/config'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`${env.THE_APP_NAME} - server running! PORT:${env.PORT}`)
  })
