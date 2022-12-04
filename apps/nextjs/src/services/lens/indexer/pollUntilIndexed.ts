import hasTxBeenIndexed from './hasTxBeenIndexed'

export async function pollUntilIndexed(input: { txHash: string } | { txId: string }) {
  while (true) {
    const response = await hasTxBeenIndexed(input)
    if (response?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult') {
      if (response?.hasTxHashBeenIndexed?.metadataStatus) {
        if (response?.hasTxHashBeenIndexed?.metadataStatus.status === 'SUCCESS') {
          return response?.hasTxHashBeenIndexed
        }

        if (response?.hasTxHashBeenIndexed?.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response?.hasTxHashBeenIndexed?.metadataStatus.status)
        }
      } else {
        if (response?.hasTxHashBeenIndexed?.indexed) {
          return response?.hasTxHashBeenIndexed
        }
      }

      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      // it got reverted and failed!
      throw new Error(response?.hasTxHashBeenIndexed?.reason)
    }
  }
}
