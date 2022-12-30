import { HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedRequest } from '@graphql/lens/generated'
import { clientLens } from '@config/graphql-request'

export async function hasTxHashBeenIndexed(request: HasTxHashBeenIndexedRequest) {
  const result = await clientLens.request(HasTxHashBeenIndexedDocument, {
    request: {
      ...request,
    },
  })

  return result
}

export default hasTxHashBeenIndexed
