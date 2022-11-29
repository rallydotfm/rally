import { client } from '@config/graphql-request'
import { AuthenticateDocument } from '@graphql/generated'
import type { SignedAuthChallenge } from '@graphql/generated'

/**
 * Allow us to authenticate the user on Lens by generating a JWT token accountToken and a refreshToken.
 * accessToken will lasts 30 minutes before needed to be refreshed
 * refreshToken lasts 7 days
 * refreshToken allow us to keep the user logged in and generate a new accessToken when they come back without them having to sign a challenge again
 */

export async function authenticate(signAuthChallengeRequest: SignedAuthChallenge) {
  const result = await client.request(AuthenticateDocument, {
    request: {
      ...signAuthChallengeRequest,
    },
  })

  return result
}

export default authenticate
