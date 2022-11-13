import { protectedProcedure, publicProcedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
const secret = process.env.NEXTAUTH_SECRET
export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    // const token = await getToken({ req })
    const token = await getToken({ req: ctx.req, secret })
    console.log('JSON Web Token', token)
    return token
  }),
  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return `
        Hello ${ctx.session.user.id}
        You are logged in and can see this secret message!
    `
  }),
})
