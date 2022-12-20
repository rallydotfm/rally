import { clientLens } from '@config/graphql-request'
import { RecommendedProfilesDocument } from '@graphql/lens/generated'
/**
 * Get recommended Lens profiles
 * @returns array of recommended Lens profile or `undefined`
 */
export async function getRecommendedProfiles() {
  const result = await clientLens.request(RecommendedProfilesDocument)

  return result
}

export default getRecommendedProfiles
