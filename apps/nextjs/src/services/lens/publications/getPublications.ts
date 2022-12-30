import { clientLens } from '@config/graphql-request'
import { PublicationsDocument } from '@graphql/lens/generated'
import type { PublicationsQueryRequest } from '@graphql/lens/generated'

export async function getPublicationsRequest(request: PublicationsQueryRequest) {
  const result = await clientLens.request(PublicationsDocument, {
    request,
  })

  return result
}

export default getPublicationsRequest
