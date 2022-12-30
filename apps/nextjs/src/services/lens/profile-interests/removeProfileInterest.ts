import { RemoveProfileInterestDocument } from '@graphql/lens/generated'
import type { RemoveProfileInterestsRequest } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'

/**
 * Remove interest to profile
 */
export async function removeProfileInterest(request: RemoveProfileInterestsRequest) {
  const result = await clientLens.request(RemoveProfileInterestDocument, {
    request,
  })
  return result
}

export default removeProfileInterest
