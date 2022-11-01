import { IconSpinner } from '@components/Icons'
import { API_GUILD_URL } from '@config/guild'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'

interface CardGuildProps {
  id: string
}
const CardGuild = (props: CardGuildProps) => {
  const { id } = props
  const [fetchEnabled, setFetchEnabled] = useState(false)

  useDebouncedEffect(
    () => {
      setFetchEnabled(true)
    },
    [id],
    3000,
    3500,
  )
  const queryGuild = useQuery(
    ['guildById', id],
    async () => {
      try {
        const response = await fetch(`${API_GUILD_URL}/guild/${id}`)
        const result = await response.json()

        return result
      } catch (e) {
        console.error(e)
        return e
      }
    },
    {
      enabled: id !== '' && fetchEnabled,
    },
  )

  if (queryGuild?.isLoading)
    return (
      <>
        <IconSpinner />
        <p>Fetching guild {id}...</p>
      </>
    )
  return (
    <article>
      <div className="overflow-hidden">
        <div className="flex items-center">
          <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
            <img className="w-full h-full object-cover" src={`${queryGuild?.data?.imageUrl}`} alt="" />
          </div>
          <span className="font-bold text-xs w-full">{queryGuild?.data?.name}</span>
        </div>

        <div>
          <span>Roles</span>
          <ul className="flex text-2xs flex-col space-y-3 divide-y divide-neutral-4">
            {queryGuild?.data?.roles?.map(
              (role: { imageUrl: string; name: string; description: string; id: string }, key: number) => {
                return (
                  <li className="py-3" key={`guild-${id}-role-${role.id}`}>
                    <img className="w-12" src={role.imageUrl} alt="" />
                    <span className="font-bold">{role.name}</span>
                    <p>{role.description}</p>
                  </li>
                )
              },
            )}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default CardGuild
