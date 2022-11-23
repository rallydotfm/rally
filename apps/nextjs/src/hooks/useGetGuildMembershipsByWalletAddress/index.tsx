import { useQuery } from '@tanstack/react-query'
import { getUserMembership } from '@services/guild/user/getUserMembership'

export function useGetGuildMembershipsByWalletAddress(address: `0x${string}`, options: any) {
  const queryUserGuildMemberships = useQuery(
    ['user-guilds-roles', address],
    async () => {
      const result = await getUserMembership(address)
      const roles = [].concat(...result?.map((guild: any) => guild?.roleIds)) ?? []
      const guilds = result ?? []

      return {
        roles,
        guilds,
      }
    },
    options,
  )

  return queryUserGuildMemberships
}

export default useGetGuildMembershipsByWalletAddress
