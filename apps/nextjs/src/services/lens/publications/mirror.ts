import { clientLens } from '@config/graphql-request'
import { CreateMirrorTypedDataDocument } from '@graphql/lens/generated'
import type { CreateMirrorRequest } from '@graphql/lens/generated'

export async function createMirrorTypedData(request: CreateMirrorRequest) {
  const result = await clientLens.request(CreateMirrorTypedDataDocument, {
    request,
  })

  return result
}

export default createMirrorTypedData
