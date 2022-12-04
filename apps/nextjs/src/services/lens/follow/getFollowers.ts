import { FollowersDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'
import type { FollowersRequest } from '@graphql/generated'

/**
 * Get the list of followers of {profileId}
 * @param request: FollowersRequest
 */
export async function getFollowers(followersRequest: FollowersRequest) {
  const result = await client.request(FollowersDocument, {
    request: {
      ...followersRequest,
    },
  })

  return result
}

export default getFollowers
