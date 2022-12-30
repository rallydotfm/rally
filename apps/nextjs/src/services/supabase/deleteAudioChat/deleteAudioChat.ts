import supabase from '@config/supabaseClient'

export async function deleteAudioChat(audioChatToDelete: string) {
  const { error } = await supabase.from('AudioChat').delete().eq('audio_chat_id', audioChatToDelete)
}

export default deleteAudioChat
