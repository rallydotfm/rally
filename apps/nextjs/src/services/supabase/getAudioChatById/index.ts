import supabase from '@config/supabaseClient'

export async function getAudioChatById(id: string) {
  const { data, error } = await supabase.from('AudioChat').select('state').is('audio_chat_id', id)
  return data
}

export default getAudioChatById
