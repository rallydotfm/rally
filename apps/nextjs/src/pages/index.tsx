import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import useGetAudioChatByState from '@hooks/useGetAudioChatByStatus'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
const Home: NextPage = () => {
  const { queriesAudioChatsByStateMetadata, queryAudioChatsByStateRawData } = useGetAudioChatByState([
    DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
    DICTIONARY_STATES_AUDIO_CHATS.READY.value,
    DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
  ])
  return (
    <>
      <Head>
        <title>Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="pt-8 max-w-screen-sm mx-auto">
        <h1 className="text-center font-bold text-3xl">
          Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities.
        </h1>
        <p className="pt-8 text-center text-neutral-11">
          This page is under construction and will be implemented in our 6th milestone.
        </p>
      </main>
    </>
  )
}

export default Home
