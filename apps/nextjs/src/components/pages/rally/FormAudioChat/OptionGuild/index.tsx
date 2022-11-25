import { IconSpinner } from '@components/Icons'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'
import useGetGuildById from '@hooks/useGetGuildById'
import GuildRequirement from '@components/GuildRequirement'
import { role } from '@guildxyz/sdk'

interface OptionGuildProps {
  id: string
  index: number
  data: any
  setData: any
  disabled: boolean
}

const OptionGuild = (props: OptionGuildProps) => {
  const { id, index, data, setData } = props
  const [fetchEnabled, setFetchEnabled] = useState(false)

  useDebouncedEffect(
    () => {
      setFetchEnabled(true)
    },
    [id],
    3000,
    3500,
  )
  const queryGuild = useGetGuildById({
    id,
    options: {
      enabled: id !== '' && fetchEnabled,
    },
  })
  if (queryGuild?.isLoading)
    return (
      <div className="flex flex-col items-center justify-center relative">
        <p className="mt-2 animate-pulse font-bold">Fetching guild {id}...</p>
      </div>
    )
  if (queryGuild?.data?.errors?.length > 0)
    return (
      <div className="flex flex-col items-center justify-center relative">
        <p className="mt-2 italic text-neutral-11">{queryGuild?.data?.errors?.[0]?.msg}</p>
      </div>
    )
  return (
    <article>
      <div className="overflow-hidden">
        <div className="flex items-center">
          <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
            {/* @ts-ignore */}
            {data()?.rally_access_control_guilds?.[index].roles.includes[role.id] && <CheckIcon />}
            <img className="w-full h-full object-cover" src={`${queryGuild?.data?.imageUrl}`} alt="" />
          </div>
          <span className="font-bold text-xs w-full">{queryGuild?.data?.name}</span>
        </div>

        <div className="mt-2">
          <span className="font-bold text-2xs uppercase">Roles</span>
          <p className="text-2xs">Pick roles</p>
          <ul className="-mis-8 flex px-5 text-2xs mt-3 flex-col">
            {queryGuild?.data?.roles?.map(
              (
                role: { requirements: Array<any>; imageUrl: string; name: string; description: string; id: string },
                key: number,
              ) => {
                return (
                  <li className="relative flex p-5 space-i-4 overflow-hidden" key={`guild-${id}-role-${role.id}`}>
                    <input
                      className="peer cursor-pointer pointer-events-auto peer absolute w-full h-full opacity-0"
                      type="checkbox"
                      defaultChecked={
                        data()?.rally_access_control_guilds?.[index].roles.includes(`${role.id}`) ? true : false
                      }
                      onChange={(e) => {
                        if (e.currentTarget.checked === true) {
                          setData(`rally_access_control_guilds.${index}.roles`, [
                            ...data()?.rally_access_control_guilds?.[index].roles,
                            `${role.id}`,
                          ])
                        }
                        if (e.currentTarget.checked === false) {
                          const updated = data()?.rally_access_control_guilds?.[index].roles.filter(
                            (guildRole: any) => `${guildRole.id}` !== `${role.id}`,
                          )
                          setData(`rally_access_control_guilds.${index}.roles`, updated)
                        }
                      }}
                    />
                    <div className="pointer-events-none w-5 mt-1 mb-auto shrink-0 aspect-square bg-neutral-1 border-2 border-neutral-7 rounded peer-checked:bg-interactive-1 relative flex items-center justify-center peer-checked:before:absolute peer-checked:before:z-10 peer-checked:before:w-2.5 peer-checked:rounded-md peer-checked:before:block peer-checked:before:bg-interactive-11 peer-checked:before:h-2.5 peer-checked:before:content-[' ']" />
                    <div className="w-max-content rounded-md overflow-hidden divide-x divide-neutral-4 grow shrink border border-neutral-6 peer-checked:ring-4 peer-checked:ring-interactive-11 grid grid-cols-1 xs:grid-cols-2">
                      <div className="bg-neutral-3 w-full col-span-1 text-xs px-4 py-3">
                        <label
                          className="font-bold text-[0.95em]"
                          htmlFor={`rally_access_control_guilds.${index}.roles.${key}`}
                        >
                          {role.name} <br />
                          <span className="opacity-75 text-2xs font-medium">
                            (
                            {Intl.NumberFormat('en-US', {
                              notation: 'compact',
                              maximumFractionDigits: 3,
                              //@ts-ignore
                            }).format(parseFloat(role.memberCount))}
                            &nbsp;members)
                          </span>
                        </label>
                      </div>
                      <div className="bg-neutral-2 col-span-1 px-6 pt-3 pb-6">
                        <span className="block tracking-widest mb-3 uppercase text-[0.75rem] opacity-50 font-bold">
                          Requirements
                        </span>
                        <ul className="text-xs font-medium space-y-3">
                          {role?.requirements.map((requirement: any, i: number) => (
                            <li
                              className="overflow-hidden space-y-3 flex flex-col text-ellipsis"
                              key={`${requirement.id}-${requirement.roleId}-${requirement.type}`}
                            >
                              <div>
                                <GuildRequirement requirement={requirement} />
                              </div>
                              {i + 1 < role.requirements.length && (
                                <span className="before:block before:z-10 before:inline-start-0 before:bg-neutral-4 before:-translate-y-1/2 before:absolute before:top-1/2 before:w-full before:h-0.5 relative flex items-center justify-center py-1 font-bold uppercase tracking-wide text-[0.7rem] text-white text-opacity-50">
                                  {/* @ts-ignore */}
                                  <span className="relative z-20 p-2 bg-neutral-2 ">{role?.logic}</span>
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

export default OptionGuild
