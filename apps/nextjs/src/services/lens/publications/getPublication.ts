import { clientLens } from '@config/graphql-request'
import { PublicationDocument } from '@graphql/lens/generated'
import type { PublicationQueryRequest } from '@graphql/lens/generated'

export async function getPublicationRequest(request: PublicationQueryRequest) {
  const result = await clientLens.request(PublicationDocument, {
    request,
  })

  return result
}

export default getPublicationRequest
