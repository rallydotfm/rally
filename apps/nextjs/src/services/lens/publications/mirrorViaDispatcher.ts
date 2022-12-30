import { clientLens } from '@config/graphql-request'
import { CreateMirrorViaDispatcherDocument } from '@graphql/lens/generated'
import type { CreateMirrorRequest } from '@graphql/lens/generated'

export async function createMirrorViaDispatcherRequest(request: CreateMirrorRequest) {
  const result = await clientLens.request(CreateMirrorViaDispatcherDocument, {
    request,
  })

  return result
}

export default createMirrorViaDispatcherRequest
