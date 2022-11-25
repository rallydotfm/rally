// src/server/router/index.ts
import { router } from '../trpc'
import { credentialsRouter } from './credentials'
import { roomRouter } from './room'

export const appRouter = router({
  credentials: credentialsRouter,
  room: roomRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
