import { RemoveProfileInterestDocument } from '@graphql/generated'
import type { RemoveProfileInterestsRequest } from '@graphql/generated'
import { client } from '@config/graphql-request'

/**
 * Remove interest to profile
 */
export async function removeProfileInterest(request: RemoveProfileInterestsRequest) {
  const result = await client.request(RemoveProfileInterestDocument, {
    request,
  })
  return result
}

export default removeProfileInterest
