import supabase from '@config/supabaseClient'

export async function getIndexedAudioChatRecordingsREST(filterParams: any) {
  const { data, error } = await supabase
    .from('AudioChat')
    .select('*')
    .in('is_nsfw', filterParams.nsfw)

    .in('category', filterParams.categories)
    .neq('recording_arweave_transaction_id', '')
    .order(filterParams.orderBy, {
      ascending: filterParams.orderDirection === 'asc' ? true : false,
    })
    .range(filterParams.skip, filterParams.skip === 0 ? filterParams.first : filterParams.skip)
  return data
}

export default getIndexedAudioChatRecordingsREST
