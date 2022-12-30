// src/server/router/index.ts
import { router } from '../trpc'
import { credentialsRouter } from './credentials'
import { roomRouter } from './room'
import { recordingsRouter } from './recordings'

export const appRouter = router({
  credentials: credentialsRouter,
  room: roomRouter,
  recordings: recordingsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
