import { ExplorePublicationsDocument } from '@graphql/lens/generated'
import type { ExplorePublicationRequest } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'

export async function explorePublications(request: ExplorePublicationRequest) {
  return clientLens.request(ExplorePublicationsDocument, {
    request,
  })
}
