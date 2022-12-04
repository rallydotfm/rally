import { AddProfileInterestDocument } from '@graphql/generated'
import type { AddProfileInterestsRequest } from '@graphql/generated'
import { client } from '@config/graphql-request'

/**
 * Add interest to profile
 */
export async function addProfileInterest(request: AddProfileInterestsRequest) {
  const result = await client.request(AddProfileInterestDocument, {
    request,
  })
  return result
}

export default addProfileInterest
