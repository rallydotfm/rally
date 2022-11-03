import { getGuildById } from '@services/guild/guild/getGuildById'
import { useQuery } from '@tanstack/react-query'

export function useGetGuildById(args: { id: string; options: any }) {
  const queryGuild = useQuery(['guildById', args.id], async () => await getGuildById(args.id), { ...args.options })
  return queryGuild
}

export default useGetGuildById
