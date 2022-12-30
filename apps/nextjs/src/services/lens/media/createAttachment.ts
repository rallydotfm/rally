import { clientLens } from '@config/graphql-request'
import { CreateAttachMediaDataDocument } from '@graphql/lens/generated'
import type { PublicMediaRequest } from '@graphql/lens/generated'

export async function getMediaRequest(request: PublicMediaRequest) {
  const result = await clientLens.request(CreateAttachMediaDataDocument, {
    request,
  })
  return result
}

export default getMediaRequest
