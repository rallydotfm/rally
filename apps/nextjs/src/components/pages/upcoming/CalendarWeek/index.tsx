import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from 'react'
import { Tab } from '@headlessui/react'
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isPast,
  startOfDay,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { ROUTE_RALLY_NEW, ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import BadgeRallyState from '@components/BadgeRallyState'
import { IconSpinner } from '@components/Icons'
import type { UseQueryResult } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import button from '@components/Button/styles'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import EthereumAddress from '@components/EthereumAddress'

interface CalendarWeekProps {
  queryAudioChats: UseQueryResult<any>
}

export default function CalendarWeek(props: CalendarWeekProps) {
  const account = useAccount()
  const queryCurrentUserDefaultLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`)
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
                className={`${
                  isBefore(startOfDay(new Date(tab.date)), startOfToday()) ? 'opacity-50' : ''
                } snap-center grow-1 shrink-0 min-w-12 2xs:min-w-unset col-span-1 items-center bg-white py-1 px-0.5 xs:px-2 ui-not-selected:bg-opacity-5 ui-selected:bg-opacity-95 flex flex-col rounded-md ui-selected:font-medium ui-not-selected:text-white ui-selected:text-black`}
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
                  <ul className="space-y-12 divide-y animate-appear divide-neutral-4">
                    {queryAudioChats?.data
                      ?.filter((event: { datetime_start_at: number | Date }) => {
                        return getDay(event.datetime_start_at) === getDay(tab.date)
                      })
                      .map(
                        (audioChat: {
                          datetime_start_at: number | Date
                          cid: any
                          image: any
                          language: string
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
                                  <div className="shrink-0 relative w-full overflow-hidden xs:w-20 sm:w-28 aspect-twitter-card xs:aspect-auto xs:grow xs:max-w-56 rounded-t-md xs:rounded-b-md">
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
                                  <div className="flex items-center mt-2 gap-4 text-2xs">
                                    {/* @ts-ignore */}
                                    {audioChat?.category && (
                                      <mark className="bg-neutral-1 text-2xs text-neutral-12 py-0.5 px-2 rounded-md font-medium">
                                        {/* @ts-ignore */}
                                        {`${DICTIONARY_PROFILE_INTERESTS?.[audioChat?.category]?.emoji} ` ?? ''}&nbsp;
                                        {/* @ts-ignore */}
                                        {DICTIONARY_PROFILE_INTERESTS?.[audioChat?.category]?.label ??
                                          // @ts-ignore
                                          DICTIONARY_PROFILE_INTERESTS_CATEGORIES?.[audioChat?.category]}
                                      </mark>
                                    )}
                                    {audioChat?.language && (
                                      <mark className="bg-transparent text-interactive-12 font-semibold">
                                        {/* @ts-ignore */}
                                        {DICTIONARY_LOCALES_SIMPLIFIED?.[audioChat?.language]}
                                      </mark>
                                    )}
                                  </div>
                                  <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                                    {audioChat?.is_gated ? 'Gated access' : 'Free access'}
                                  </p>
                                  <p className="mt-4 flex flex-col gap-2 font-medium text-2xs">
                                    <span className="italic opacity-75">Hosted by </span>

                                    <EthereumAddress
                                      displayLensProfile={true}
                                      shortenOnFallback={true}
                                      //@ts-ignore
                                      address={audioChat?.creator}
                                    />
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
                      No rally {/* @ts-ignore */}
                      {account?.address && queryCurrentUserDefaultLensProfile?.data?.interests?.length > 0
                        ? 'matching your interests'
                        : ''}{' '}
                      taking place on that day
                    </p>
                  </>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      <section className="animate-appear mt-32 py-8 px-6 mx-auto text-start xs:text-center bg-neutral-3 w-full rounded-lg flex flex-col xs:items-center justify-center max-w-screen-xs">
        <p className="font-bold">Want to host live audio rooms ?</p>
        <p className="text-xs mt-2  text-neutral-11">
          Rally makes it easy to create and find interesting audio rooms without compromising your privacy or recreating
          your audience from scratch.
        </p>
        <p className="text-xs mt-4 font-medium text-neutral- mb-6">
          If you're looking for an alternative to Twitter Space or Clubhouse, give Rally a try and see how it can help
          you connect with your audience.
        </p>
        <Link href={ROUTE_RALLY_NEW}>
          <a className={button({ scale: 'sm', intent: 'primary-outline' })}>Create my rally now</a>
        </Link>
      </section>
    </>
  )
}
