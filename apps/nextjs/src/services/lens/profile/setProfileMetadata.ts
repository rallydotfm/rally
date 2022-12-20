import { clientLens } from '@config/graphql-request'
import { CreateSetProfileMetadataTypedDataDocument } from '@graphql/lens/generated'
import type { CreatePublicSetProfileMetadataUriRequest } from '@graphql/lens/generated'

export async function createSetProfileMetadataTypedData(request: CreatePublicSetProfileMetadataUriRequest) {
  const result = await clientLens.request(CreateSetProfileMetadataTypedDataDocument, {
    request,
  })

  return result
}

export default createSetProfileMetadataTypedData
