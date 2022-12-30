import { DoesFollowDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { DoesFollowRequest } from '@graphql/lens/generated'

/**
 * Get the if address {0x${string}} follows profile {profileId}
 * @param request: DoesFollowRequest
 */
export async function getDoesFollow(doesFollowRequest: DoesFollowRequest) {
  const result = await clientLens.request(DoesFollowDocument, {
    request: {
      ...doesFollowRequest,
    },
  })

  return result
}

export default getDoesFollow
