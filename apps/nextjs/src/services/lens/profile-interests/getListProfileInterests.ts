import { ProfileInterestsDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'

/**
 * Get list of interests available on Lens
 * @returns Array<string>
 */
export async function getListProfileInterests() {
  const result = await clientLens.request(ProfileInterestsDocument)
  return result
}

export default getListProfileInterests
