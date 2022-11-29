import { ProfileInterestsDocument } from '@graphql/generated'
import { client } from '@config/graphql-request'

/**
 * Get list of interests available on Lens
 * @returns Array<string>
 */
export async function getListProfileInterests() {
  const result = await client.request(ProfileInterestsDocument)
  return result
}

export default getListProfileInterests
