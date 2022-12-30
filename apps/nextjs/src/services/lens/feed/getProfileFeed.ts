import { ProfileFeedDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { FeedRequest } from '@graphql/lens/generated'

export async function getProfileFeedRequest(request: FeedRequest) {
  const result = await clientLens.request(ProfileFeedDocument, {
    request,
  })
  return result
}
