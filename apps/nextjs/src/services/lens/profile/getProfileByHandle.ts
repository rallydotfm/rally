import { client } from '@config/urql'
import { ProfileDocument } from '@graphql/generated'
import type { SingleProfileQueryRequest } from '@graphql/generated'

/**
 * Get Lens profile by handle
 * @param request: `{ handle: string }`
 * @returns Lens profile Profile or `undefined`
 */
export async function getProfileByHandleRequest(request: SingleProfileQueryRequest) {
  const profile = await client
    .query(ProfileDocument, {
      request,
    })
    .toPromise()
  return profile
}

export default getProfileByHandleRequest
