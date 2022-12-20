import { clientLens } from '@config/graphql-request'
import { CreateCommentTypedDataDocument } from '@graphql/lens/generated'
import type { CreatePublicCommentRequest } from '@graphql/lens/generated'

export async function createCommentTypedData(request: CreatePublicCommentRequest) {
  const result = await clientLens.request(CreateCommentTypedDataDocument, {
    request,
  })

  return result
}

export default createCommentTypedData
