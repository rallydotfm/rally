import { clientLens } from '@config/graphql-request'
import { HidePublicationDocument } from '@graphql/lens/generated'
import type { HidePublicationRequest } from '@graphql/lens/generated'

export async function deletePublicationRequest(request: HidePublicationRequest) {
  const result = await clientLens.request(HidePublicationDocument, {
    request,
  })

  return result
}
export default deletePublicationRequest
