import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useGetAudioChatById } from '@hooks/useGetAudioChatById'
import { IconSpinner } from '@components/Icons'
import { ROUTE_HOME } from '@config/routes'
import Link from 'next/link'
import button from '@components/Button/styles'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import Button from '@components/Button'
import { useAccount } from 'wagmi'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import CountdownOpening from '@components/pages/rally/CountdownOpening'
import { isFuture } from 'date-fns'

const Page: NextPage = () => {
  const {
    query: { idRally },
    isReady,
  } = useRouter()
  //@ts-ignore
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(idRally)
  const { address } = useAccount()
  return (
    <>
      <Head>
        <title> {queryAudioChatMetadata?.data?.name ?? 'Live audio chat'} - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <div className="animate-appear flex flex-col grow">
        <header className="bg-gradient-to-b from-neutral-1 flex-col flex relative overflow-hidden px-6 pt-1 -mt-8 -mx-6">
          <nav>
            <Link href={ROUTE_HOME}>
              <a className={button({ intent: 'neutral-ghost', scale: 'sm' })}>
                <ArrowLeftIcon className="w-5 mie-1ex" />
                Back
              </a>
            </Link>
          </nav>
          <div className="relative self-center rounded-md mt-10 w-48 overflow-hidden aspect-square">
            <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
            <img
              src={`https://ipfs.io/ipfs/${queryAudioChatMetadata?.data?.image}`}
              className="relative z-10 w-full h-full object-cover"
              alt=""
              width="192px"
              height="192px"
              loading="lazy"
            />
          </div>

          <div className="mt-5 mx-auto">
            <h1 className="font-bold text-4xl">{queryAudioChatMetadata?.data?.name}</h1>
          </div>
          {(isFuture(queryAudioChatMetadata?.data?.datetime_start_at) ?? false) && (
            <div className="animate-appear mx-auto mt-8">
              <CountdownOpening startsAt={queryAudioChatMetadata?.data?.datetime_start_at} />
            </div>
          )}
          {address === queryAudioChatMetadata?.data?.creator &&
            [STATES_AUDIO_CHATS.PENDING, STATES_AUDIO_CHATS.PLANNED].includes(queryAudioChatMetadata.data?.state) && (
              <div className="animate-appear mt-5 flex justify-center">
                <Button>Start live</Button>
              </div>
            )}
          {queryAudioChatMetadata?.data?.state === STATES_AUDIO_CHATS.LIVE && (
            <div className="flex flex-col items-center animate-appear mt-8 justify-center">
              <Button>Join live</Button>
              <p className="text-neutral-11 pt-5 text-2xs">Your mic will be muted when you join.</p>
            </div>
          )}
        </header>
        <main>
          {!isReady ||
            queryAudioChatByIdRawData?.status === 'loading' ||
            (queryAudioChatMetadata?.status === 'loading' && (
              <div className="mx-auto pt-8 px-6 animate-appear flex items-center space-i-1ex">
                <IconSpinner className="animate-spin text-md " />
                <p className="font-medium animate-pulse">Loading rally...</p>
              </div>
            ))}

          <section className="-mx-6 pt-8 px-6 animate-appear">
            <h2 className="uppercase text-neutral-12 tracking-widest font-bold mb-4">About</h2>
            <p className="text-md text-neutral-11">{queryAudioChatMetadata?.data?.description}</p>
          </section>
        </main>
      </div>
    </>
  )
}

export default Page
