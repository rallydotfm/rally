import supabase from '@config/supabaseClient'

export async function getIndexedAudioChatREST(filterParams: any) {
  console.log('hey', filterParams)
  let { data, error } = await supabase
    .from('AudioChat')
    .select('*')

    // Filters
    //.in('is_gated', filterParams.gated)
    //.in('is_nsfw', filterParams.nsfw)
    // Arrays
    .in('state', filterParams.states)
  //.lte('start_at', new Date(parseInt(filterParams.start_at_max.toString()) * 1000).toISOString())
  //.gte('created_at', new Date(parseInt(filterParams.start_at_min.toString()) * 1000).toISOString())
  console.log('OurData here', data)
  return data
}
/*
new Date(parseInt(start_at.toString()) * 1000).toISOString()
state
name
description
image
is_nsfw
will_be_recorded
is_gated
max_attendees
language
recording_arweave_transaction_id
start_at
created_at
category
*/

export default getIndexedAudioChatREST
