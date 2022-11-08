import { t } from './../trpc'
import { AccessToken } from 'livekit-server-sdk'
import { object, string } from 'zod'

export const roomsRouter = t.router({
  join: t.procedure
    .input(
      object({
        id_rally: string(),
        cid_rally: string(),
        user_ethereum_address: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user_ethereum_address, id_rally, cid_rally } = input
      try {
        const response = await fetch(`https://${cid_rally}.ipfs.w3s.link/data.json`)
        const result = await response.json()

        const {
          access_control: { whitelist, guilds },
        } = result
        if (whitelist.includes(user_ethereum_address)) {
          const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET_KEY, {
            identity: user_ethereum_address,
          })

          at.addGrant({
            room: id_rally,
            roomRecord: true,
            roomJoin: true,
            roomAdmin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
          })

          const token = at.toJwt()

          return {
            token,
          }
        } else {
          const response = await fetch(`https://api.guild.xyz/v1/user/membership/${user_ethereum_address}`)
          const result = await response.json()
        }
      } catch (e) {
        console.error(e)
      }
    }),
})
