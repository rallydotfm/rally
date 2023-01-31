// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter, createContext } from '@rally/api'

// export API handler
export default createNextApiHandler({
  //@ts-ignore
  router: appRouter,
  createContext: createContext,
})
