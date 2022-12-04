import { HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedRequest } from '@graphql/generated'
import { client } from '@config/graphql-request'

export async function hasTxHashBeenIndexed(request: HasTxHashBeenIndexedRequest) {
  const result = await client.request(HasTxHashBeenIndexedDocument, {
    request: {
      ...request,
    },
  })

  return result
}

export default hasTxHashBeenIndexed
