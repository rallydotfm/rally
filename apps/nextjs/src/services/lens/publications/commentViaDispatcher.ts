import { clientLens } from '@config/graphql-request'
import { CreateCommentViaDispatcherDocument } from '@graphql/lens/generated'
import type { CreatePublicCommentRequest } from '@graphql/lens/generated'

export async function createCommentViaDispatcher(request: CreatePublicCommentRequest) {
  const result = await clientLens.request(CreateCommentViaDispatcherDocument, {
    request,
  })

  return result
}

export default createCommentViaDispatcher
