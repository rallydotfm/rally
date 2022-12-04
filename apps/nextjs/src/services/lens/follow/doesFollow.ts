import { DoesFollowDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'
import type { DoesFollowRequest } from '@graphql/generated'

/**
 * Get the if address {0x${string}} follows profile {profileId}
 * @param request: DoesFollowRequest
 */
export async function getDoesFollow(doesFollowRequest: DoesFollowRequest) {
  const result = await client.request(DoesFollowDocument, {
    request: {
      ...doesFollowRequest,
    },
  })

  return result
}

export default getDoesFollow
