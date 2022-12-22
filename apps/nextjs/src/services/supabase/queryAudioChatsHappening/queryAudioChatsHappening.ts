import supabase from '@config/supabaseClient'
import endOfDay from 'date-fns/endOfDay'
import startOfDay from 'date-fns/startOfDay'

export async function queryAudioChatsHappeningSoon() {
  const endOfTheDay = endOfDay(new Date()).toISOString()
  var startOfTheDay = startOfDay(new Date()).toISOString()
  let { data, error } = await supabase
    .from('AudioChat')
    .select('*')
    .eq('state', 1)
    .lte('start_at', endOfTheDay)
    .gte('start_at', startOfTheDay)

  return data
}

export async function queryAudioChatsHappeningLater() {
  let { data, error } = await supabase.from('AudioChat').select('*').eq('state', 0)
  /*if (error) {
    throw new Error(error.message)
  }*/
  return data
}

export async function queryAudioChatsHappeningNow() {
  let { data, error } = await supabase.from('AudioChat').select('*').eq('state', 2)
  console.log(data)
  return data
}
