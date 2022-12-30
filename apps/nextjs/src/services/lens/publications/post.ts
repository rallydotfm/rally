import { clientLens } from '@config/graphql-request'
import { CreatePostTypedDataDocument } from '@graphql/lens/generated'
import type { CreatePublicPostRequest } from '@graphql/lens/generated'

export async function createPostTypedData(request: CreatePublicPostRequest) {
  const result = await clientLens.request(CreatePostTypedDataDocument, {
    request,
  })

  return result
}

export default createPostTypedData
