import { clientLens } from '@config/graphql-request'
import { RemoveReactionDocument } from '@graphql/lens/generated'
import type { ReactionRequest } from '@graphql/lens/generated'

export async function removeReactionRequest(request: ReactionRequest) {
  const result = await clientLens.request(RemoveReactionDocument, {
    request,
  })

  return result
}

export default removeReactionRequest
