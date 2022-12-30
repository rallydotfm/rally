import { clientLens } from '@config/graphql-request'
import { AddReactionDocument } from '@graphql/lens/generated'
import type { ReactionRequest } from '@graphql/lens/generated'

export async function addReactionRequest(request: ReactionRequest) {
  const result = await clientLens.request(AddReactionDocument, {
    request,
  })

  return result
}

export default addReactionRequest
