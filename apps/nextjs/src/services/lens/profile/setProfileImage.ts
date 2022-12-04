import { client } from '@config/graphql-request'
import { CreateSetProfileImageUriTypedDataDocument } from '@graphql/generated'
import type { UpdateProfileImageRequest } from '@graphql/generated'

export async function createSetProfileImageUriTypedData(request: UpdateProfileImageRequest) {
  const result = await client.request(CreateSetProfileImageUriTypedDataDocument, {
    request,
  })

  return result
}

export default createSetProfileImageUriTypedData
