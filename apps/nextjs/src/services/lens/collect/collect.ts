import { CreateCollectTypedDataDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { CreateCollectRequest } from '@graphql/lens/generated'

export async function createCollectTypedData(request: CreateCollectRequest) {
  const result = await clientLens.request(CreateCollectTypedDataDocument, {
    request,
  })

  return result
}

export default createCollectTypedData
