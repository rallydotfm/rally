import button from '@components/Button/styles'
import useGetGuildById from '@hooks/useGetGuildById'
import useGetGuildMembershipsByWalletAddress from '@hooks/useGetGuildMembershipsByWalletAddress'
import { useAccount } from 'wagmi'

interface CardGuildMembershipProps {
  id: string
}

export const CardGuildMembership = (props: CardGuildMembershipProps) => {
  const { id } = props
  const account = useAccount()
  const queryGuild = useGetGuildById({ id, options: { enabled: true } })
  const queryCurrentUserGuildMemberships = useGetGuildMembershipsByWalletAddress(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  return (
    <article className="animate-appear h-full bg-neutral-2 p-4 rounded-md flex flex-col 2xs:flex-row 2xs:space-i-6">
      <div className="relative shrink-0 w-12 h-12 overflow-hidden rounded-full">
        <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />

        {queryGuild?.data?.imageUrl && (
          <img
            className="w-full h-full object-cover overflow-hidden absolute inset-0 z-10"
            src={queryGuild.data.imageUrl}
            alt={queryGuild?.data?.name}
          />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-neutral-12 pt-1 text-xs">
          {queryGuild?.isLoading ? (
            <>Loading guild #{id}...</>
          ) : queryGuild?.isError ? (
            `Guild ${id}`
          ) : (
            queryGuild?.data?.name
          )}
        </h3>
        {queryGuild?.data?.description && (
          <p className="pt-2 mb-3 text-2xs text-neutral-11 overflow-hidden text-ellipsis leading-[25px] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
            {queryGuild?.data?.description}
          </p>
        )}
        {account?.address && (
          <>
            {queryCurrentUserGuildMemberships?.data?.guilds.filter((guild: { guildId: string }) => guild.guildId === id)
              ?.length === 0 ? (
              <a
                className={button({
                  intent: 'primary-outline',
                  scale: 'xs',
                  class: 'animate-appear w-fit-content mt-2 2xs:mt-auto',
                })}
                target="_blank"
                href={`https://guild.xyz/${id}`}
                rel="noopener noreferrer"
              >
                Join
              </a>
            ) : (
              <span className="text-2xs text-primary-10 font-bold animate-appear mt-auto">Joined</span>
            )}
          </>
        )}
      </div>
    </article>
  )
}

export default CardGuildMembership
