// src/server/router/index.ts
import { router } from '../trpc'
import { credentialsRouter } from './credentials'
export const appRouter = router({
  credentials: credentialsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
