import { CreateUnfollowTypedDataDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { UnfollowRequest } from '@graphql/lens/generated'

export const createUnfollowTypedData = async (request: UnfollowRequest) => {
  const result = await clientLens.request(CreateUnfollowTypedDataDocument, {
    request,
  })

  return result
}

export default createUnfollowTypedData
