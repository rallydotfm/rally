import supabase from '@config/supabaseClient'

export async function getIndexedAudioChatREST(filterParams: any) {
  const { data, error } = await supabase
    .from('AudioChat')
    .select('*')
    .in('is_gated', filterParams.gated)
    .in('is_nsfw', filterParams.nsfw)
    .in('category', filterParams.categories)
    .in('state', filterParams.states)
    .lte('start_at', new Date(parseInt(filterParams.start_at_max.toString()) * 1000).toISOString())
    .gte('start_at', new Date(parseInt(filterParams.start_at_min.toString()) * 1000).toISOString())
    .order(filterParams.orderBy, {
      ascending: filterParams.orderDirection === 'asc' ? true : false,
    })
    .range(filterParams.skip, filterParams.skip === 0 ? filterParams.first : filterParams.skip)
  return data
}

export default getIndexedAudioChatREST
