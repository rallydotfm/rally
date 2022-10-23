import { t } from './../trpc'
import jwt from 'jsonwebtoken'
import uuid4 from 'uuid4'

export const credentialsRouter = t.router({
  login: t.procedure.mutation(({ ctx }) => {
    const token = jwt.sign(
      {
        access_key: process.env.MS_APP_ACCESS_KEY,
        type: 'management',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      },
      process.env.MS_APP_SECRET as string,
      {
        algorithm: 'HS256',
        expiresIn: '24h',
        jwtid: uuid4(),
      },
    )

    return {
      token,
    }
  }),
})
