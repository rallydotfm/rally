import Button from '@components/Button'
import { IconSpinner } from '@components/Icons'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { isThisWeek } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'

import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import CalendarWeek from '@components/pages/upcoming/CalendarWeek'

export function useUpcomingAudioChats() {
  const { chain } = useNetwork()
  const [weeklyAudioChats, setWeeklyAudioChats] = useState([])
  const queryAudioChatsByStateRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatsByState',
    enabled: chain?.unsupported === false ? true : false,
    args: [
      [
        DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
        DICTIONARY_STATES_AUDIO_CHATS.READY.value,
        DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
      ],
    ],
    onSuccess(data) {
      const upcoming = data
        ?.filter((audioChat) => {
          return isThisWeek(new Date(parseInt(`${audioChat.start_at}`) * 1000))
        })
        //@ts-ignore
        .sort((a, b) => {
          return parseInt(`${a.start_at}`) * 1000 < parseInt(`${b.start_at}`)
        })
      //@ts-ignore
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
        ? weeklyAudioChats.map((audioChat: any) => {
            return {
              queryKey: ['upcoming-audio-chat-metadata', audioChat?.audio_event_id],
              queryFn: async () => {
                const cid = audioChat?.cid_metadata
                try {
                  const response = await fetch(`https://${cid}.ipfs.w3s.link/data.json`)
                  const result = await response.json()
                  return {
                    id: audioChat.audio_event_id,
                    cid: audioChat.cid_metadata,
                    //@ts-ignore
                    state: DICTIONARY_STATES_AUDIO_CHATS[audioChat?.state],
                    creator: audioChat.creator,
                    epoch_time_start_at: parseInt(`${audioChat.start_at}`) * 1000,
                    epoch_time_created_at: parseInt(`${audioChat.created_at}`) * 1000,
                    datetime_start_at: new Date(parseInt(`${audioChat.start_at}`) * 1000),
                    datetime_created_at: new Date(parseInt(`${audioChat.created_at}`) * 1000),
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
        {queryAudioChatsByStateRawData.status === 'error' && <>Error</>}
        {queryAudioChatsByStateRawData.status === 'success' && (
          <>
            <div className="mb-3 animate-appear  flex justify-between">
              <h2 className="font-medium text-xs text-neutral-11">
                {queriesUpcomingAudioChatsMetadata.filter((query) => query?.status === 'success')?.length} rallies
                happening this week
              </h2>
            </div>
            <CalendarWeek
              events={queriesUpcomingAudioChatsMetadata?.filter((query) => isThisWeek(query?.data?.datetime_start_at))}
            />
          </>
        )}
        {(queryAudioChatsByStateRawData.status === 'loading' ||
          queriesUpcomingAudioChatsMetadata.filter((query) => query?.status === 'loading')?.length > 0) && (
          <div className="mb-6 flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading upcoming rallies...</p>
          </div>
        )}
      </main>
    </>
  )
}

export default Page
