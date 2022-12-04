import { client } from '@config/graphql-request'
import { CreateSetProfileMetadataTypedDataDocument } from '@graphql/generated'
import type { CreatePublicSetProfileMetadataUriRequest } from '@graphql/generated'

export async function createSetProfileMetadataTypedData(request: CreatePublicSetProfileMetadataUriRequest) {
  const result = await client.request(CreateSetProfileMetadataTypedDataDocument, {
    request,
  })

  return result
}

export default createSetProfileMetadataTypedData
