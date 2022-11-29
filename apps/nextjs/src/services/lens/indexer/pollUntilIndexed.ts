import hasTxBeenIndexed from './hasTxBeenIndexed'

export async function pollUntilIndexed(input: { txHash: string } | { txId: string }) {
  while (true) {
    const response = await hasTxBeenIndexed(input)

    if (response.__typename === 'TransactionIndexedResult') {
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.status)
        }
      } else {
        if (response.indexed) {
          return response
        }
      }

      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      // it got reverted and failed!
      throw new Error(response.reason)
    }
  }
}
