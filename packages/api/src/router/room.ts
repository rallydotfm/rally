import { RoomServiceClient } from 'livekit-server-sdk'
import { publicProcedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
import { boolean, object, string } from 'zod'

const secret = process.env.NEXTAUTH_SECRET

export const roomRouter = router({
  react: publicProcedure
    .input(
      object({
        id_rally: string(),
        reaction: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, reaction } = input

      const client = new RoomServiceClient(
        `wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`,
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_SECRET_KEY,
      )

      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub

        const data = JSON.stringify({
          reaction: {
            emoji: reaction,
            emitted_at: Date.now(),
          },
        })
        client.updateParticipant(id_rally, user_ethereum_address, data)
      } catch (e) {
        console.error(e)
      }
    }),
  update_audience_member_permissions: publicProcedure
    .input(
      object({
        id_rally: string(),
        id_user: string(),
        can_publish: boolean(),
        can_subscribe: boolean(),
        can_publish_data: boolean(),
        can_join: boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, id_user, ...permissions } = input

      const client = new RoomServiceClient(
        `wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`,
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_SECRET_KEY,
      )

      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub

        await client.updateParticipant(id_rally, user_ethereum_address, undefined, {
          canPublish: permissions.can_publish,
          canSubscribe: permissions.can_subscribe,
          canPublishData: permissions.can_publish_data,
          hidden: false,
          recorder: false,
        })
      } catch (e) {
        console.error(e)
      }
    }),
  raise_hand: publicProcedure
    .input(
      object({
        id_rally: string(),
        new_is_hand_raised_value: boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, new_is_hand_raised_value } = input

      const client = new RoomServiceClient(
        `wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`,
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_SECRET_KEY,
      )

      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub

        const data = JSON.stringify({
          is_hand_raised: new_is_hand_raised_value,
        })
        client.updateParticipant(id_rally, user_ethereum_address, data)
      } catch (e) {
        console.error(e)
      }
    }),
})
