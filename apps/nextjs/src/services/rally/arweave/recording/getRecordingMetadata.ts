export async function getRecordingMetadata(transactionId: string) {
  try {
    const response = await fetch(`https://arweave.net/${transactionId}`)
    const result = await response.json()
    return {
      ...result,
      recording_file: result?.media?.[0]?.item,
    }
  } catch (e) {
    console.error(e)
  }
}

export default getRecordingMetadata
