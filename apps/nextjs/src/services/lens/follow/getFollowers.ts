import { FollowersDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { FollowersRequest } from '@graphql/lens/generated'

/**
 * Get the list of followers of {profileId}
 * @param request: FollowersRequest
 */
export async function getFollowers(followersRequest: FollowersRequest) {
  const result = await clientLens.request(FollowersDocument, {
    request: {
      ...followersRequest,
    },
  })

  return result
}

export default getFollowers
