import { useQuery } from '@tanstack/react-query'
import getRecordingMetadata from '@services/rally/arweave/recording/getRecordingMetadata'

export function useGetAudioChatPublishedRecording(audioChatId: string, recordingMetadataArweaveTxId: string) {
  const queryPublishedRecording = useQuery(
    ['audio-chat-published-recording-metadata', audioChatId, recordingMetadataArweaveTxId],
    async () => {
      //@ts-ignore
      const metadata = await getRecordingMetadata(recordingMetadataArweaveTxId)
      return metadata
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        !audioChatId ||
        audioChatId === '' ||
        recordingMetadataArweaveTxId === null ||
        !recordingMetadataArweaveTxId ||
        recordingMetadataArweaveTxId === ''
          ? false
          : true,
    },
  )

  return queryPublishedRecording
}

export default useGetAudioChatPublishedRecording
