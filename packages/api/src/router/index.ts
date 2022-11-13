// src/server/router/index.ts
import { t } from '../trpc'

export const appRouter = t.router({
  // credentials: credentialsRouter,
  // rooms: roomsRouter,
  //
})

// export type definition of API
export type AppRouter = typeof appRouter
