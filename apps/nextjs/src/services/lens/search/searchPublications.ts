import { clientLens } from '@config/graphql-request'
import { SearchPublicationsDocument } from '@graphql/lens/generated'
import type { SearchQueryRequest } from '@graphql/lens/generated'

export async function searchRequest(request: SearchQueryRequest) {
  const result = await clientLens.request(SearchPublicationsDocument, {
    request,
  })

  return result
}
