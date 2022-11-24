import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

const isAuthed = t.middleware(({ ctx, next }) => {
  //@ts-ignore
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated',
    })
  }

  return next({
    ctx: {
      //@ts-ignore
      session: ctx.session,
    },
  })
})

export const router = t.router
export const public_procedure = t.procedure
export const protected_procedure = t.procedure.use(isAuthed)
