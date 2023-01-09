import { clientStoredat } from '@config/graphql-request'

export async function createJSONData(args: {
  groupId: string
  provider: string
  data: string
  metadata: Array<{ name: string; value: string }>
}) {
  const { provider, groupId, data, metadata } = args
  let result
  if (provider === 'ARWEAVE') {
    result = await clientStoredat.request(`
  mutation {
    CreateData(
      groupId: "${groupId}"
      provider: ARWEAVE
      content: {
        contentType: JSON
        data: ${data}
        metadata: ${metadata}
      }
    ) {
      operation
      providerId
      groupId
      url
      statusCode
      errorMessage
    }
  }`)
  } else {
    result = await clientStoredat.request(`
    mutation {
      CreateData(
        groupId: "${groupId}"
        provider: FILECOIN
        content: {
          contentType: JSON
          data: ${data}
          metadata: ${metadata}
        }
      ) {
        operation
        providerId
        groupId
        url
        statusCode
        errorMessage
      }
    }`)
  }

  return result
}

export default createJSONData
