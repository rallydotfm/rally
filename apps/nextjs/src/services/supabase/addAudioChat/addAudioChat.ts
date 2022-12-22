import supabase from '@config/supabaseClient'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

export async function addAudioChat(audioChatData: any) {
  const {
    audio_event_id,
    cid_metadata,
    current_state,
    creator,
    name,
    description,
    image,
    category,
    is_gated,
    max_attendees,
    language,
    is_nsfw,
    start_at,
    created_at,
    will_be_recorded,

    recording_arweave_transaction_id,
  } = audioChatData
  const convertToTimestampStartAt = new Date(parseInt(start_at.toString()) * 1000).toISOString()
  const convertToTimestampCreatedAt = new Date(parseInt(created_at.toString()) * 1000).toISOString()
  console.log(audioChatData)
  const { data, error } = await supabase.from('AudioChat').upsert([
    {
      audio_chat_id: audio_event_id,
      cid_metadata: cid_metadata,
      //@ts-ignore
      state:
        typeof current_state === 'string' || current_state instanceof String
          ? //@ts-ignore
            [
              DICTIONARY_STATES_AUDIO_CHATS.PLANNED,
              DICTIONARY_STATES_AUDIO_CHATS.LIVE,
              DICTIONARY_STATES_AUDIO_CHATS.READY,
              DICTIONARY_STATES_AUDIO_CHATS.FINISHED,
              DICTIONARY_STATES_AUDIO_CHATS.CANCELLED,
            ]?.filter((stateA) => stateA.label === current_state)?.[0].value
          : current_state,
      creator: creator,
      name: name,
      description: description,
      image: image,
      is_nsfw: is_nsfw,
      will_be_recorded: will_be_recorded,
      is_gated: is_gated,
      max_attendees: max_attendees,
      language: language,
      recording_arweave_transaction_id: recording_arweave_transaction_id,
      start_at: Number.isInteger(start_at) ? new Date(created_at).toISOString() : convertToTimestampStartAt,
      created_at: Number.isInteger(created_at) ? new Date(created_at).toISOString() : convertToTimestampCreatedAt,
      category: category,
    },
  ])
  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
  /*   audio_chat_id
start_at
created_at
cid_metadata
state
creator
name
description
image
category
is_gated
max_attendees
language
recording_arweave_transaction_id
*/
}
export default addAudioChat
