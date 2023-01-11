import { clientLens } from '@config/graphql-request'
import { PublicationsDocument } from '@graphql/lens/generated'
import type { PublicationsQueryRequest } from '@graphql/lens/generated'

export async function getPublicationsRequest(request: PublicationsQueryRequest, profileId?: string) {
  const result = await clientLens.request(PublicationsDocument, {
    request,
    profileId,
  })

  return result
}

export default getPublicationsRequest
