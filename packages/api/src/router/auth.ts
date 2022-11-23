import { protected_procedure, public_procedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
const secret = process.env.NEXTAUTH_SECRET
export const authRouter = router({
  getSession: public_procedure.query(async ({ ctx }) => {
    // const token = await getToken({ req })
    const token = await getToken({ req: ctx.req, secret })
    return token
  }),
  getSecretMessage: protected_procedure.query(({ ctx }) => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return `
        Hello ${ctx.session.user.id}
        You are logged in and can see this secret message!
    `
  }),
})
