import { clientLens } from '@config/graphql-request'
import { SearchProfilesDocument } from '@graphql/lens/generated'
import type { SearchQueryRequest } from '@graphql/lens/generated'

export async function searchProfilesRequest(request: SearchQueryRequest) {
  const result = await clientLens.request(SearchProfilesDocument, {
    request,
  })

  return result
}
