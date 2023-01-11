import { clientLens } from '@config/graphql-request'
import { ProfileDocument } from '@graphql/lens/generated'
import type { SingleProfileQueryRequest } from '@graphql/lens/generated'

/**
 * Get Lens profile by handle
 * @param request: `{ handle: string }` | `{id: string }`
 * @returns Lens profile Profile or `undefined`
 */
export async function getProfileRequest(profileRequest: SingleProfileQueryRequest) {
  const result = await clientLens.request(ProfileDocument, {
    request: {
      ...profileRequest,
    },
  })

  return result
}

export default getProfileRequest
