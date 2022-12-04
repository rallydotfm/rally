import { client } from '@config/graphql-request'
import { DefaultProfileDocument } from '@graphql/generated'
import type { DefaultProfileRequest } from '@graphql/generated'

/**
 * Get the default Lens profile associated to an Ethereum address
 * @param request: DefaultProfileRequest
 * @returns associated Lens profile or `undefined`
 */
export async function getDefaultProfile(profileRequest: DefaultProfileRequest) {
  const result = await client.request(DefaultProfileDocument, {
    request: {
      ...profileRequest,
    },
  })

  return result
}

export default getDefaultProfile
