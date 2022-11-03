import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import type { BigNumber } from 'ethers'

export async function getAudioChatMetadata(audioChat: {
  audio_event_id: `0x${string}`
  start_at: BigNumber
  created_at: BigNumber
  cid_metadata: string
  state: number
  creator: `0x${string}`
}) {
  const cid = audioChat?.cid_metadata
  try {
    const response = await fetch(`https://${cid}.ipfs.w3s.link/data.json`)
    const result = await response.json()
    return {
      id: audioChat?.audio_event_id,
      cid: audioChat?.cid_metadata,
      //@ts-ignore
      state: DICTIONARY_STATES_AUDIO_CHATS[audioChat?.state],
      creator: audioChat?.creator,
      datetime_start_at: new Date(parseInt(`${audioChat?.start_at}`) * 1000),
      datetime_created_at: new Date(parseInt(`${audioChat?.created_at}`) * 1000),
      epoch_time_start_at: parseInt(`${audioChat?.start_at}`) * 1000,
      epoch_time_created_at: parseInt(`${audioChat?.created_at}`) * 1000,
      ...result,
    }
  } catch (e) {
    console.error(e)
  }
}

export default getAudioChatMetadata
