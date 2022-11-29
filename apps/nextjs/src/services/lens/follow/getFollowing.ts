import { FollowingDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'
import type { FollowingRequest } from '@graphql/generated'

/**
 * Get the list followed profile
 * @param request: FollowingRequest
 */
export async function getFollowing(followingRequest: FollowingRequest) {
  const result = await client.request(FollowingDocument, {
    request: {
      ...followingRequest,
    },
  })

  return result
}

export default getFollowing
