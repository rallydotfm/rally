import { clientLens } from '@config/graphql-request'
import { CreatePostViaDispatcherDocument } from '@graphql/lens/generated'
import type { CreatePublicPostRequest } from '@graphql/lens/generated'

export async function createPostAttachViaDispatcherRequest(request: CreatePublicPostRequest) {
  const result = await clientLens.request(CreatePostViaDispatcherDocument, {
    request,
  })

  return result
}

export default createPostAttachViaDispatcherRequest
