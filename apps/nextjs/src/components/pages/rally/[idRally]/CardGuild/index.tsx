import useGetGuildById from '@hooks/useGetGuildById'

interface CardGuildProps {
  guild: any
}

export const CardGuild = (props: CardGuildProps) => {
  const { guild } = props
  const queryGuild = useGetGuildById({ id: guild.guild_id, options: { enabled: true } })

  if (queryGuild.isLoading) return <p>Loading...</p>
  if (queryGuild.isError) return <p>Error!</p>
  return (
    <article className="grid gap-5 grid-cols-1 2xs:grid-cols-12">
      <img className="col-span-2 rounded-md" src={queryGuild.data.imageUrl} alt={queryGuild?.data?.name} />
      <h3 className="-translate-y-1 col-span-5 font-semibold text-xs">{queryGuild.data.name}</h3>
      <ul className="col-span-5 flex flex-wrap gap-1.5 text-2xs font-medium text-neutral-12">
        {queryGuild?.data?.roles
          ?.filter((role: any) => guild?.roles?.includes(`${role.id}`))
          ?.map((role: any) => {
            return (
              <li key={`requirement-${role}-${role.id}`}>
                <mark className="bg-neutral-6 text-neutral-12 px-2 rounded font-medium">{role.name}</mark>
              </li>
            )
          })}
      </ul>
    </article>
  )
}

export default CardGuild
