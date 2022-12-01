import { CreateUnfollowTypedDataDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'
import type { UnfollowRequest } from '@graphql/generated'

export const createUnfollowTypedData = async (request: UnfollowRequest) => {
  const result = await client.request(CreateUnfollowTypedDataDocument, {
    request,
  })

  return result
}

export default createUnfollowTypedData
