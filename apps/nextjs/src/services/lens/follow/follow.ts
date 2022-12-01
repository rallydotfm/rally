import { CreateFollowTypedDataDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'
import type { FollowRequest } from '@graphql/generated'

export const createFollowTypedData = async (request: FollowRequest) => {
  const result = await client.request(CreateFollowTypedDataDocument, {
    request,
  })

  return result
}

export default createFollowTypedData