import Button from '@components/Button'
import useGetGuildById from '@hooks/useGetGuildById'

interface CardGuildProps {
  guild: any
}

export const CardGuild = (props: CardGuildProps) => {
  const { guild } = props
  const queryGuild = useGetGuildById({ id: guild.guild_id, options: { enabled: true } })

  if (queryGuild.isLoading) return <p className="text-2xs text-center animate-pulse font-bold">Loading...</p>
  if (queryGuild.isError)
    return (
      <div className="animate-appear flex flex-col">
        <p className="text-2xs text-center font-bold text-neutral-12 italic">
          We couldn't fetch the data of this guild.
        </p>
        <Button className="mt-3 mx-auto" scale="xs" intent="neutral-outline">
          Try again
        </Button>
      </div>
    )
  return (
    <article className="animate-appear grid gap-3 xs:gap-5 grid-cols-12">
      <img
        className="col-span-3 xs:col-span-2 rounded-md"
        src={queryGuild.data.imageUrl}
        alt={queryGuild?.data?.name}
      />
      <h3 className="self-center xs:self-start col-span-9 xs:col-span-5 font-semibold text-xs">
        {queryGuild.data.name}
      </h3>
      <ul className="col-span-12 xs:col-span-5 flex flex-wrap gap-1.5 text-2xs font-medium text-neutral-12">
        {queryGuild?.data?.roles
          ?.filter((role: any) => guild?.roles?.includes(`${role.id}`))
          ?.map((role: any) => {
            return (
              <li className="animate-appear" key={`requirement-${role}-${role.id}`}>
                <mark className="bg-neutral-6 text-neutral-12 px-2 rounded font-medium">{role.name}</mark>
              </li>
            )
          })}
      </ul>
    </article>
  )
}

export default CardGuild
