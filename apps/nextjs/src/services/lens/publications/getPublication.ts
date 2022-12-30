import { clientLens } from '@config/graphql-request'
import { PublicationDocument } from '@graphql/lens/generated'
import type { PublicationQueryRequest } from '@graphql/lens/generated'

export async function getPublicationRequest(request: PublicationQueryRequest, profileId?: string) {
  const result = await clientLens.request(PublicationDocument, {
    request,
    profileId,
  })

  return result
}

export default getPublicationRequest
