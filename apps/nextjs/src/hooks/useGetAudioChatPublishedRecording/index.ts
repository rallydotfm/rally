import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import getRecordingMetadata from '@services/rally/arweave/recording/getRecordingMetadata'
import base64ToJson from '@helpers/base64ToJson'
import useLit from '@hooks/useLit'
import { useAccount } from 'wagmi'
import { useUpdateEffect } from '@react-hookz/web'

export function useGetAudioChatPublishedRecording(audioChatId: string, recordingMetadataArweaveAsBase64: string) {
  const account = useAccount()
  const { mutationDecryptText, mutationSignMessage } = useLit()
  const queryClient = useQueryClient()

  const queryPublishedRecording = useQuery(
    ['audio-chat-published-recording-metadata', audioChatId, recordingMetadataArweaveAsBase64],
    async () => {
      try {
        const recordingMetadataArweave = base64ToJson(recordingMetadataArweaveAsBase64)
        const { access_control_conditions, arweave_transaction_id, encrypted_symmetric_key } = recordingMetadataArweave
        if (access_control_conditions !== 'FREE' || encrypted_symmetric_key !== null) {
          return {
            encrypted: true,
            encryptedText: arweave_transaction_id,
            encryptedSymmetricKey: encrypted_symmetric_key,
            accessControlConditions: access_control_conditions,
          }
        } else {
          //@ts-ignore
          const metadata = await getRecordingMetadata(arweave_transaction_id)
          return metadata
        }
      } catch (e) {
        console.error(e)
        return null
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        !audioChatId ||
        audioChatId === '' ||
        recordingMetadataArweaveAsBase64 === null ||
        !recordingMetadataArweaveAsBase64 ||
        recordingMetadataArweaveAsBase64 === ''
          ? false
          : true,
    },
  )

  const mutationDecryptMetadata = useMutation(async () => {
    const recordingMetadataArweave = base64ToJson(recordingMetadataArweaveAsBase64)
    const { access_control_conditions, arweave_transaction_id, encrypted_symmetric_key } = recordingMetadataArweave

    const decrypted = await mutationDecryptText.mutateAsync({
      encryptedText: arweave_transaction_id,
      encryptedSymmetricKey: encrypted_symmetric_key,
      accessControlConditions: access_control_conditions,
    })
    return decrypted
  })

  const queryDecryptPublishedRecording = useQuery(
    ['decrypt-published-recording-metadata', audioChatId, recordingMetadataArweaveAsBase64],
    async () => {
      const metadata = await getRecordingMetadata(mutationDecryptMetadata?.data?.decryptedString)
      return metadata
    },
    {
      refetchOnWindowFocus: false,
      enabled: mutationDecryptMetadata?.data?.decryptedString && mutationDecryptMetadata?.isSuccess ? true : false,
    },
  )

  useUpdateEffect(() => {
    mutationDecryptMetadata.reset()
    mutationSignMessage.reset()
    queryClient.resetQueries(['decrypt-published-recording-metadata', audioChatId, recordingMetadataArweaveAsBase64], {
      exact: true,
    })
  }, [account?.address])

  return {
    queryPublishedRecording,
    queryDecryptPublishedRecording,
    mutationDecryptMetadata,
    mutationSignDecryptMetadataMessage: mutationSignMessage,
  }
}

export default useGetAudioChatPublishedRecording
