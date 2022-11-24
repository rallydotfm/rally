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
      <main>hello world !</main>
    </>
  )
}

export default Home
