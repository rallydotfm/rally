import useGetAudioChatById from '@hooks/useGetAudioChatById'

export function useGetAudioChatToEdit(id: `0x${string}`) {
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(id)

  return {
    queryAudioChatByIdRawData,
    queryAudioChatMetadata,
  }
}

export default useGetAudioChatToEdit
