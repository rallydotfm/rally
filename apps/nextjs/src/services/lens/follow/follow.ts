import { CreateFollowTypedDataDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { FollowRequest } from '@graphql/lens/generated'

export const createFollowTypedData = async (request: FollowRequest) => {
  const result = await clientLens.request(CreateFollowTypedDataDocument, {
    request,
  })

  return result
}

export default createFollowTypedData
