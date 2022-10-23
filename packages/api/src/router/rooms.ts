import { t } from './../trpc'
import { literal, object, string, number } from 'zod'
import jwt from 'jsonwebtoken'
import uuid4 from 'uuid4'

const ENDPOINT = process.env.API_ENDPOINT_REALTIME
export const roomsRouter = t.router({
  infiniteList: t.procedure
    .input(
      object({
        limit: number().nullish(),
        cursor: string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { managementToken } = ctx.authorization
      const { cursor, limit } = input
      try {
        const result = await fetch(`${ENDPOINT}/rooms?limit=${limit ? limit : 100}${cursor ? `&last=${cursor}` : ''}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${managementToken}`,
            'Content-Type': 'application/json',
          },
        })

        const rooms = await result.json()
        let nextCursor: typeof cursor | undefined = undefined
        if (rooms?.data?.length > 100) {
          nextCursor = rooms?.last
        }
        return {
          items: rooms?.data,
          nextCursor,
        }
      } catch (e) {
        console.error(e)
        return e
      }
    }),
  byId: t.procedure.input(object({ id: string() })).query(async ({ ctx, input }) => {
    const { managementToken } = ctx.authorization
    try {
      const result = await fetch(`${ENDPOINT}/v2/rooms/${input.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
      })

      const res = await result.json()
      return res
    } catch (e) {
      console.error(e)
      return e
    }
  }),
  create: t.procedure.mutation(async ({ ctx }) => {
    const { managementToken } = ctx.authorization
    try {
      const result = await fetch(`${ENDPOINT}/rooms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'test-room',
          template_id: process.env.REALTIME_TEMPLATE_ID,
        }),
      })

      const res = await result.json()
      return res
    } catch (e) {
      console.error(e)
      return e
    }
  }),
  credentials: t.procedure
    .input(
      object({
        ethereum_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
        room_id: string(),
        role: literal('listener').or(literal('moderator')).or(literal('speaker')),
      }),
    )
    .mutation(({ ctx, input }) => {
      const payload = {
        access_key: process.env.MS_APP_ACCESS_KEY,
        room_id: input.room_id,
        user_id: input.ethereum_address,
        role: input.role,
        type: 'app',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000) - 1,
      }

      const token = jwt.sign(payload, process.env.MS_APP_SECRET as string, {
        algorithm: 'HS256',
        expiresIn: '24h',
        jwtid: uuid4(),
      })

      return {
        token,
      }
    }),
})
