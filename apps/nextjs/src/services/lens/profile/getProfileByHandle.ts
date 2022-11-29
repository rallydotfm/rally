import { client } from '@config/graphql-request'
import { ProfileDocument } from '@graphql/generated'
import type { SingleProfileQueryRequest } from '@graphql/generated'

/**
 * Get Lens profile by handle
 * @param request: `{ handle: string }`
 * @returns Lens profile Profile or `undefined`
 */
export async function getProfileByHandleRequest(profileRequest: SingleProfileQueryRequest) {
  const result = await client.request(ProfileDocument, {
    request: {
      ...profileRequest,
    },
  })

  return result
}

export default getProfileByHandleRequest
