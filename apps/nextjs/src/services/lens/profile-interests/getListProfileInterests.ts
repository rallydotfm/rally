import { client } from '@config/urql'
import { ProfileInterestsDocument } from '@graphql/generated'

/**
 * Get Lens profile by handle
 * @param request: `{ handle: string }`
 * @returns Lens profile Profile or `undefined`
 */
export async function getListProfileInterests() {
  const profile = await client.query(ProfileInterestsDocument).toPromise()
  return profile
}

export default getListProfileInterests
