import useGetGuildById from '@hooks/useGetGuildById'

interface CardGuildProps {
  guild: any
}

export const CardGuild = (props: CardGuildProps) => {
  const { guild } = props
  const queryGuild = useGetGuildById({ id: guild.guild_id, options: { enabled: true } })

  if (queryGuild.isLoading) return <p>Loading...</p>
  if (queryGuild.isError) return <p>Error!</p>
  const guildRoles = queryGuild.data.roles.filter((role: any) => guild.roles.includes(`${role.id}`))
  return (
    <>
      <h3>{queryGuild.data.name}</h3>
      <img src={queryGuild.data.imageUrl} alt="guild member" />
      {guildRoles.map((role: any) => {
        ;<p>{role.name}</p>
      })}
    </>
  )
}

export default CardGuild
