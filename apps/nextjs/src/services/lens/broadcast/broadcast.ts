import { BroadcastDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { BroadcastRequest } from '@graphql/lens/generated'

export async function broadcastRequest(request: BroadcastRequest) {
  const result = await clientLens.request(BroadcastDocument, {
    request,
  })

  return result
}

export default broadcastRequest
