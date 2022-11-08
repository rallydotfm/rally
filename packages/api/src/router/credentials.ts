import { t } from './../trpc'
import { AccessToken } from 'livekit-server-sdk'

export const credentialsRouter = t.router({
  login: t.procedure.mutation(({ ctx }) => {
    const at = new AccessToken('api-key', 'secret-key', {
      identity: participantName,
    })
    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

    const token = at.toJwt()

    return {
      token,
    }
  }),
})
