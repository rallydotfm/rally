import { client } from '@config/graphql-request'
import { CreateSetDispatcherTypedDataDocument } from '@graphql/generated'
import type { SetDispatcherRequest } from '@graphql/generated'

export async function disableDispatcherWithTypedData(request: SetDispatcherRequest) {
  const result = await client.request(CreateSetDispatcherTypedDataDocument, {
    request,
  })

  return result
}

export default disableDispatcherWithTypedData
