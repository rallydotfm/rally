import supabase from '@config/supabaseClient'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

export async function audioChatChangeState(changedStateParams: any) {
  let newState = changedStateParams.state
  let chatId = changedStateParams.chatId
  let { data, error } = await supabase
    .from('AudioChat')
    .update({
      //@ts-ignore
      state: [
        DICTIONARY_STATES_AUDIO_CHATS.PLANNED,
        DICTIONARY_STATES_AUDIO_CHATS.LIVE,
        DICTIONARY_STATES_AUDIO_CHATS.READY,
        DICTIONARY_STATES_AUDIO_CHATS.FINISHED,
        DICTIONARY_STATES_AUDIO_CHATS.CANCELLED,
      ]?.filter((stateA) => stateA.label === newState)?.[0].value,
    })
    .eq('audio_chat_id', chatId)
}
export default audioChatChangeState
