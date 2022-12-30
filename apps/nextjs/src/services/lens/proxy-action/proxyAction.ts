import { ProxyActionDocument } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'
import type { ProxyActionRequest } from '@graphql/lens/generated'

export async function proxyActionRequest(request: ProxyActionRequest) {
  const result = await clientLens.request(ProxyActionDocument, {
    request,
  })

  return result
}

export default proxyActionRequest
