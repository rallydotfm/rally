import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from 'react'
import { Tab } from '@headlessui/react'
import { eachDayOfInterval, endOfWeek, format, getDay, isPast, startOfWeek } from 'date-fns'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import BadgeRallyState from '@components/BadgeRallyState'
import { IconSpinner } from '@components/Icons'
import type { UseQueryResult } from '@tanstack/react-query'
interface CalendarWeekProps {
  queryAudioChats: UseQueryResult<any>
}

export default function CalendarWeek(props: CalendarWeekProps) {
  const [weekDay] = useState(
    eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    }).map((day) => ({
      date: day,
      day: format(new Date(day), 'dd'),
    })),
  )
  const { queryAudioChats } = props

  return (
    <>
      {queryAudioChats?.data?.audioChats?.length === 0 && <p>There's no upcoming rallies this week.</p>}
      <div className="w-full animate-appear">
        <Tab.Group defaultIndex={getDay(new Date())}>
          <Tab.List className="pb-4 2xs:pb-0 snap-mandatory snap-x w-screen justify-between overflow-x-auto 2xs:w-full flex 2xs:grid gap-3 grid-cols-7 -mx-2 px-2 xs:mx-0 xs:px-0">
            {weekDay.map((tab) => (
              <Tab
                key={`${tab.day}`}
                className="snap-center grow-1 shrink-0 min-w-12 2xs:min-w-unset col-span-1 items-center bg-white py-1 px-0.5 xs:px-2 ui-not-selected:bg-opacity-5 ui-selected:bg-opacity-95 flex flex-col rounded-md ui-selected:font-medium ui-not-selected:text-white ui-selected:text-black"
              >
                <span className="text-2xs">
                  <span className="sr-only">{format(new Date(tab.date), 'iiii')}</span>
                  <span className="xs:hidden">{format(new Date(tab.date), 'EEEEEE')}</span>
                  <span className="hidden xs:block">{format(new Date(tab.date), 'iiiiii')}</span>
                </span>
                <span className="font-bold text-sm">{tab.day}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {weekDay.map((tab) => (
              <Tab.Panel key={`panel-${tab.day}`}>
                {queryAudioChats.isLoading && (
                  <div className="mb-6 flex items-center justify-center space-i-1ex">
                    <IconSpinner className="text-lg animate-spin" />
                    <p className="font-bold animate-pulse">Loading upcoming rallies...</p>
                  </div>
                )}
                {queryAudioChats?.data?.filter((event: { datetime_start_at: number | Date }) => {
                  return getDay(event.datetime_start_at) === getDay(tab.date)
                })?.length > 0 ? (
                  <ul className="space-y-8 divide-y animate-appear divide-neutral-4">
                    {queryAudioChats?.data
                      ?.filter((event: { datetime_start_at: number | Date }) => {
                        return getDay(event.datetime_start_at) === getDay(tab.date)
                      })
                      .map(
                        (audioChat: {
                          datetime_start_at: number | Date
                          cid: any
                          image: any
                          name:
                            | string
                            | number
                            | boolean
                            | ReactElement<any, string | JSXElementConstructor<any>>
                            | ReactFragment
                            | ReactPortal
                            | null
                            | undefined
                          state: string | number | null | undefined
                          is_gated: any
                          id: string
                        }) => {
                          return (
                            <li
                              className={`${
                                isPast(audioChat.datetime_start_at) ? 'opacity-50' : ''
                              } pt-6 animate-appear relative`}
                              key={`panel-${audioChat.cid}`}
                            >
                              <span className="font-bold block mb-2">
                                {format(audioChat.datetime_start_at, 'HH:mm')}
                              </span>
                              <article className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
                                {audioChat?.image && (
                                  <div className="relative w-full overflow-hidden xs:w-20 sm:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
                                    <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
                                    <img
                                      alt=""
                                      loading="lazy"
                                      width="128px"
                                      height="86px"
                                      src={`https://ipfs.io/ipfs/${audioChat?.image}`}
                                      className="relative z-10 block w-full h-full object-cover "
                                    />
                                  </div>
                                )}

                                <div className="px-4 flex-grow flex flex-col xs:px-0">
                                  <h1 className="font-bold flex flex-col-reverse">
                                    <span className="py-2">{audioChat?.name}</span>
                                    <BadgeRallyState state={audioChat?.state} />
                                  </h1>
                                  <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                                    {audioChat?.is_gated ? 'Gated access' : 'Free access'}
                                  </p>
                                </div>
                              </article>
                              <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', audioChat?.id)}>
                                <a className="absolute z-10 opacity-0 inset-0 w-full h-full">View rally page</a>
                              </Link>
                            </li>
                          )
                        },
                      )}
                  </ul>
                ) : (
                  <>
                    <p className="text-center py-12 text-neutral-11 animate-appear italic">
                      No rally taking place on that day
                    </p>
                  </>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}
