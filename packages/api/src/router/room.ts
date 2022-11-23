import { RoomServiceClient } from 'livekit-server-sdk'
import { public_procedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
import { boolean, object, string } from 'zod'

const secret = process.env.NEXTAUTH_SECRET
const client = new RoomServiceClient(
  `wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_SECRET_KEY,
)

export const roomRouter = router({
  react: public_procedure
    .input(
      object({
        id_rally: string(),
        reaction: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, reaction } = input

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
  pin_message: public_procedure
    .input(
      object({
        id_rally: string(),
        pinned_media_url: string(),
        pinned_media_message: string().optional(),
        room_previous_metadata: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub

        const { id_rally, pinned_media_url, pinned_media_message, room_previous_metadata } = input

        const room_metadata_base = JSON.parse(room_previous_metadata === '' ? '{}' : room_previous_metadata)

        const room_newest_metadata = JSON.stringify({
          ...room_metadata_base,
          messages: [
            ...(room_metadata_base?.messages ?? []),
            {
              pinned_by: user_ethereum_address,
              media_url: pinned_media_url,
              message: pinned_media_message,
              inserted_at: new Date(),
            },
          ],
        })

        client.updateRoomMetadata(id_rally, room_newest_metadata)
      } catch (e) {
        console.error(e)
        return {
          err: e,
        }
      }
    }),

  update_room_ban_list: public_procedure
    .input(
      object({
        id_rally: string(),
        id_user: string(),
        metadata: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, id_user, metadata } = input

      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')
        await client.updateParticipant(id_rally, id_user, undefined, {
          canPublish: false,
          canSubscribe: false,
          canPublishData: false,
          hidden: false,
          recorder: false,
        })
        await client.updateRoomMetadata(id_rally, metadata)
        await client.removeParticipant(id_rally, id_user)
        return {
          id_user,
        }
      } catch (e) {
        console.error(e)
      }
    }),
  update_audience_member_permissions: public_procedure
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

      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        await client.updateParticipant(id_rally, id_user, undefined, {
          canPublish: permissions.can_publish,
          canSubscribe: permissions.can_subscribe,
          canPublishData: permissions.can_publish_data,
          hidden: false,
          recorder: false,
        })
        if (!permissions.can_subscribe) await client.removeParticipant(id_rally, id_user)
        return {
          id_user,
        }
      } catch (e) {
        console.error(e)
      }
    }),
  raise_hand: public_procedure
    .input(
      object({
        id_rally: string(),
        new_is_hand_raised_value: boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, new_is_hand_raised_value } = input

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

        return new_is_hand_raised_value
      } catch (e) {
        console.error(e)
      }
    }),
  //@TODO
  // add delete_room procedure
  // uses `client.deleteRoom` under the room
  // see docs https://docs.livekit.io/server/room-management/#deleteroom
})
