import { clientLens } from '@config/graphql-request'
import { CreateSetFollowModuleTypedDataDocument } from '@graphql/lens/generated'
import type { CreateSetFollowModuleRequest } from '@graphql/lens/generated'

export async function createSetFollowModuleTypedData(request: CreateSetFollowModuleRequest) {
  const result = await clientLens.request(CreateSetFollowModuleTypedDataDocument, {
    request,
  })

  return result
}

export default createSetFollowModuleTypedData
