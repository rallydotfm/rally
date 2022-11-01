import Button from '@components/Button'
import { IconSpinner } from '@components/Icons'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { format, formatRelative, getWeek, isThisWeek } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/20/solid'
import CalendarWeek from '@components/pages/upcoming/CalendarWeek'

export function useUpcomingAudioChats() {
  const { chain } = useNetwork()
  const [weeklyAudioChats, setWeeklyAudioChats] = useState([])
  const queryAudioChatsByStateRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatsByState',
    enabled: chain?.unsupported === false ? true : false,
    args: [[0]],
    onSuccess(data) {
      const upcoming = data
        ?.filter((audioChat) => {
          return isThisWeek(new Date(parseInt(`${audioChat.eventTimestamp}`) * 1000))
        })
        .sort((a, b) => {
          return parseInt(`${a.eventTimestamp}`) * 1000 < parseInt(`${b.eventTimestamp}`)
        })

      setWeeklyAudioChats(upcoming)
    },
    onError(e) {
      console.error(e)
    },
  })
  const queriesUpcomingAudioChatsMetadata = useQueries({
    //@ts-ignore
    enabled: queryAudioChatsByStateRawData?.data?.length > 0 ?? false,
    queries:
      weeklyAudioChats?.length > 0
        ? weeklyAudioChats.map((audioChat) => {
            return {
              queryKey: ['upcoming-audio-chat-metadata', audioChat?.cid_metadata],
              queryFn: async () => {
                const cid = audioChat?.cid_metadata
                try {
                  const response = await fetch(`https://${cid}.ipfs.w3s.link/data.json`)
                  const result = await response.json()
                  return {
                    id: audioChat.audioEventId,
                    cid: audioChat.cid_metadata,
                    //@ts-ignore
                    state: STATES_AUDIO_CHATS[audioChat?.state],
                    creator: audioChat.creator,
                    epoch_time_start_at: parseInt(`${audioChat.eventTimestamp}`) * 1000,
                    epoch_time_created_at: parseInt(`${audioChat.createdAt}`) * 1000,
                    datetime_start_at: new Date(parseInt(`${audioChat.eventTimestamp}`) * 1000),
                    datetime_created_at: new Date(parseInt(`${audioChat.createdAt}`) * 1000),
                    ...result,
                  }
                } catch (e) {
                  console.error(e)
                }
              },
            }
          })
        : [],
  })

  return {
    queriesUpcomingAudioChatsMetadata,
    queryAudioChatsByStateRawData,
  }
}

const Page: NextPage = () => {
  const { queriesUpcomingAudioChatsMetadata, queryAudioChatsByStateRawData } = useUpcomingAudioChats()

  return (
    <>
      <Head>
        <title>Upcoming rallies this week - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main>
        {(queryAudioChatsByStateRawData.status === 'loading' ||
          queriesUpcomingAudioChatsMetadata.filter((query) => query?.status === 'loading')?.length > 0) && (
          <div className="mb-6 flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading upcoming rallies...</p>
          </div>
        )}
        {queryAudioChatsByStateRawData.status === 'error' && <>Error</>}
        {queryAudioChatsByStateRawData.status === 'success' && (
          <>
            <div className="mb-3 animate-appear  flex justify-between">
              <h2 className="font-medium text-xs text-neutral-11">
                {queriesUpcomingAudioChatsMetadata.filter((query) => query?.status === 'success')?.length} rallies
                happening this week
              </h2>
              <Button intent="neutral-ghost" scale="xs" onClick={() => queryAudioChatsByStateRawData.refetch()}>
                Refresh
              </Button>
            </div>
            <CalendarWeek
              events={queriesUpcomingAudioChatsMetadata?.filter((query) => isThisWeek(query?.data?.datetime_start_at))}
            />
            <ul className="hidden space-y-8 animate-appear">
              {queriesUpcomingAudioChatsMetadata
                .filter((query) => isThisWeek(query?.data?.datetime_start_at))
                .map((audioChat) => {
                  return (
                    <li
                      className="animate-appear relative overflow-hidden focus-within:bg-neutral-3 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1"
                      key={audioChat.data.id}
                    >
                      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', audioChat.data.id)}>
                        <a className="absolute inset-0 w-full h-full opacity-0">View page</a>
                      </Link>
                      <div className="xs:pt-2 xs:pis-2 xs:pie-4">
                        <article className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
                          <div className="relative w-full overflow-hidden xs:w-20 sm:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
                            <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
                            <img
                              alt=""
                              loading="lazy"
                              width="128px"
                              height="86px"
                              src={`https://ipfs.io/ipfs/${audioChat.data.image}`}
                              className="relative z-10 block w-full h-full object-cover "
                            />
                          </div>

                          <div className="px-4 flex-grow flex flex-col xs:px-0">
                            {' '}
                            <h1 className="font-bold">{audioChat.data.name}</h1>
                            {audioChat.data.state !== STATES_AUDIO_CHATS.CANCELLED ? (
                              <>
                                <p className="mt-2 font-medium flex items-start text-neutral-12 text-xs">
                                  <CalendarIcon className="translate-y-1 opacity-90 shrink-0 w-5 mie-2" />
                                  {formatRelative(audioChat.data.datetime_start_at, new Date())}
                                  <span>&nbsp;({format(audioChat.data.datetime_start_at, 'OOOO')})</span>
                                </p>
                              </>
                            ) : (
                              'Cancelled'
                            )}
                            <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                              {audioChat.data.is_private ? 'Gated access' : 'Free access'}
                            </p>
                            <p className="text-neutral-11 text-2xs mt-2">
                              {audioChat.data.cohosts_list.length} cohosts
                            </p>
                          </div>
                        </article>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </main>
    </>
  )
}

export default Page
