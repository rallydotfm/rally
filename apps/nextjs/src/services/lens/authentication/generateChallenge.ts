import { client } from '@config/graphql-request'
import { ChallengeDocument } from '@graphql/generated'
import type { ChallengeRequest } from '@graphql/generated'

/**
 * Generate a challenge (some text the user has to sign with their wallet to prove their ownership.)
 * The challenge will only last 5 minutes before it expires.
 * If the challenge expires, a new one must be generated.
 * Challenges are single-use: once a challenge was used to generate a JWT token, it won't work anymore
 */

export async function generateChallenge(challengeRequest: ChallengeRequest) {
  const result = await client.request(ChallengeDocument, {
    request: {
      ...challengeRequest,
    },
  })
  return result
}
