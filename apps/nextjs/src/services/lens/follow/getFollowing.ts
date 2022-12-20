import { FollowingDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { FollowingRequest } from '@graphql/lens/generated'

/**
 * Get the list of profiles followed by an Ethereum address
 * @param request: FollowingRequest
 */
export async function getFollowing(followingRequest: FollowingRequest) {
  const result = await clientLens.request(FollowingDocument, {
    request: {
      ...followingRequest,
    },
  })

  return result
}

export default getFollowing
