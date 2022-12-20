import { AddProfileInterestDocument } from '@graphql/lens/generated'
import type { AddProfileInterestsRequest } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'

/**
 * Add interest to profile
 */
export async function addProfileInterest(request: AddProfileInterestsRequest) {
  const result = await clientLens.request(AddProfileInterestDocument, {
    request,
  })
  return result
}

export default addProfileInterest
