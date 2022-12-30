import { clientLens } from '@config/graphql-request'
import { CreateSetProfileImageUriTypedDataDocument } from '@graphql/lens/generated'
import type { UpdateProfileImageRequest } from '@graphql/lens/generated'

export async function createSetProfileImageUriTypedData(request: UpdateProfileImageRequest) {
  const result = await clientLens.request(CreateSetProfileImageUriTypedDataDocument, {
    request,
  })

  return result
}

export default createSetProfileImageUriTypedData
