import { clientLens } from '@config/graphql-request'
import { CreateSetDispatcherTypedDataDocument } from '@graphql/lens/generated'
import type { SetDispatcherRequest } from '@graphql/lens/generated'

export async function disableDispatcherWithTypedData(request: SetDispatcherRequest) {
  const result = await clientLens.request(CreateSetDispatcherTypedDataDocument, {
    request,
  })

  return result
}

export default disableDispatcherWithTypedData
