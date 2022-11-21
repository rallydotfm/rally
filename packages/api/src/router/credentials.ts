import { AccessToken } from 'livekit-server-sdk'
import { publicProcedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
import { object, string } from 'zod'

const secret = process.env.NEXTAUTH_SECRET

export const credentialsRouter = router({
  getRoomCredential: publicProcedure
    .input(
      object({
        id_rally: string(),
        cid_rally: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id_rally, cid_rally } = input
      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub

        // generate basic access token from their wallet address
        const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET_KEY, {
          identity: sub,
        })

        // get the information of the rally by fetching the JSON with all its data
        const response = await fetch(`https://${cid_rally}.ipfs.w3s.link/data.json`)
        const result = await response.json()

        const {
          access_control: { whitelist, guilds },
        } = result

        if (whitelist?.includes(user_ethereum_address)) {
          // if the user address is in the whitelist
          // user = admin/mod/cohost
          at.addGrant({
            room: id_rally,
            roomRecord: true,
            roomJoin: true,
            roomAdmin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
          })
        } else if (
          result?.guests_list &&
          result?.guests_list?.length > 0 &&
          result?.guests_list.map((guest: { eth_address: string }) => guest.eth_address).includes(user_ethereum_address)
        ) {
          // if there's a guest list and the user address is in it
          at.addGrant({
            room: id_rally,
            roomRecord: false,
            roomJoin: true,
            roomAdmin: false,
            canPublish: true,
            canSubscribe: true,
            canPublishData: false,
          })
        } else {
          // if the audio room is gated
          if (guilds.length > 0) {
            // get user roles
            // and check if the access control list contains those roles
            const response = await fetch(`https://api.guild.xyz/v1/user/membership/${user_ethereum_address}`)
            const result = await response.json()
            //@ts-ignore
            const user_roles = [].concat(...result.map((guild) => guild.roleIds))
            //@ts-ignore
            const guild_allowed_roles = [].concat(...guilds.map((guild) => guild.roles))
            const is_user_allowed = guild_allowed_roles.filter((role) => user_roles.includes(role))?.length > 0
            // if the user has the roles
            // they are a listener
            if (is_user_allowed) {
              at.addGrant({
                room: id_rally,
                roomRecord: false,
                roomJoin: true,
                roomAdmin: false,
                canPublish: false,
                canSubscribe: true,
                canPublishData: false,
              })
            } else {
              // otherwise we prevent them from joining the room
              at.addGrant({
                room: id_rally,
                roomRecord: false,
                roomJoin: false,
                roomAdmin: false,
                canPublish: false,
                canSubscribe: false,
                canPublishData: false,
              })
            }
          } else {
            // audioroom is not gated
            at.addGrant({
              room: id_rally,
              roomRecord: false,
              roomJoin: true,
              roomAdmin: false,
              canPublish: false,
              canSubscribe: true,
              canPublishData: false,
            })
          }
        }
        const token = at.toJwt()
        return {
          token,
        }
      } catch (e) {
        console.error(e)
      }
    }),
})
