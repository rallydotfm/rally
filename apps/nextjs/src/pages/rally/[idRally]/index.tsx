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
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import CountdownOpening from '@components/pages/rally/CountdownOpening'
import { isFuture } from 'date-fns'
import { useGoLiveAudioChat, useStoreTxUiGoLiveRally } from '@hooks/useGoLiveAudioChat'
import { useEndLiveAudioChat, useStoreTxUiEndLiveRally } from '@hooks/useEndLiveAudioChat'
import DialogGoLive from '@components/DialogGoLive'
import DialogEndLive from '@components/DialogEndLive'
import Notice from '@components/Notice'
import { trpc } from '@utils/trpc'
const Page: NextPage = () => {
  const {
    query: { idRally },
    isReady,
  } = useRouter()
  //@ts-ignore
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(idRally)
  const { address } = useAccount()

  const stateTxUiRallyGoLive = useStoreTxUiGoLiveRally()
  const { onClickGoLive, stateGoLive } = useGoLiveAudioChat(stateTxUiRallyGoLive)

  const stateTxUiEndLiveRally = useStoreTxUiEndLiveRally()
  const { onClickEndLive, stateEndLiveAudioChat } = useEndLiveAudioChat(stateTxUiEndLiveRally)
  const mutationJoinRoom = trpc.credentials.getRoomCredential.useMutation({
    onSuccess(data) {
      // do something hre
      this.roomService = data?.token
      // connect to room
    },
  })

  return (
    <>
      <Head>
        <title>
          {' '}
          {queryAudioChatByIdRawData?.data?.audio_event_id ===
          '0x0000000000000000000000000000000000000000000000000000000000000000'
            ? 'Not found'
            : queryAudioChatMetadata?.data?.name ?? 'Live audio chat'}{' '}
          - Rally
        </title>
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
          {queryAudioChatMetadata?.data?.image && (
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
          )}

          <h1 className="sr-only">{queryAudioChatMetadata?.data?.name}</h1>
        </header>
        <main className="flex flex-col grow justify-center items-center">
          <h1 className="font-bold text-4xl flex items-center flex-col-reverse">
            <span>{queryAudioChatMetadata?.data?.name}</span>
            <span className="text-2xs uppercase tracking-wider">{queryAudioChatMetadata?.data?.state}</span>
          </h1>
          {queryAudioChatMetadata?.data?.state === DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label &&
            (isFuture(queryAudioChatMetadata?.data?.datetime_start_at) ?? false) && (
              <div className="animate-appear mx-auto mt-8">
                <CountdownOpening startsAt={queryAudioChatMetadata?.data?.datetime_start_at} />
              </div>
            )}
          {address === queryAudioChatMetadata?.data?.creator &&
            [DICTIONARY_STATES_AUDIO_CHATS.READY.label, DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label].includes(
              queryAudioChatMetadata.data?.state,
            ) && (
              <div className="animate-appear mt-5 flex justify-center">
                <Button
                  onClick={async () => {
                    stateTxUiRallyGoLive.setDialogVisibility(true)
                    await onClickGoLive(queryAudioChatMetadata.data?.id)
                  }}
                >
                  Start live
                </Button>
              </div>
            )}

          {queryAudioChatMetadata?.data?.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label && (
            <div className="flex flex-col items-center animate-appear mt-8 justify-center">
              <div className="flex space-i-3 items-center">
                <Button
                  onClick={async () => {
                    await mutationJoinRoom.mutate({
                      id_rally: queryAudioChatByIdRawData.data?.audio_event_id,
                      cid_rally: queryAudioChatByIdRawData.data?.cid_metadata,
                    })
                  }}
                >
                  Join audio room
                </Button>
                {queryAudioChatMetadata?.data.creator === address && (
                  <>
                    <span className="italic text-neutral-9">or</span>
                    <Button
                      onClick={async () => {
                        stateTxUiEndLiveRally.setDialogVisibility(true)
                        await onClickEndLive(queryAudioChatMetadata.data?.id)
                      }}
                      intent="primary-outline"
                    >
                      End rally
                    </Button>
                  </>
                )}
              </div>
              <p className="text-neutral-11 pt-5 text-2xs">Your mic will be muted when you join.</p>
            </div>
          )}

          {!isReady ||
            queryAudioChatByIdRawData?.status === 'loading' ||
            (queryAudioChatMetadata?.status === 'loading' &&
              queryAudioChatByIdRawData?.data?.audio_event_id !==
                '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                <div className="mx-auto pt-8 px-6 animate-appear flex items-center space-i-1ex">
                  <IconSpinner className="animate-spin text-md " />
                  <p className="font-medium animate-pulse">Loading rally...</p>
                </div>
              ))}

          {queryAudioChatByIdRawData?.data?.audio_event_id ===
            '0x0000000000000000000000000000000000000000000000000000000000000000' && (
            <section>
              <h2 className="text-3xl mb-4 font-bold">Rally not found.</h2>
              <p className="mb-8">This rally doesn't exist or was deleted by its creator.</p>
              <Link href={ROUTE_HOME}>
                <a className={button({ scale: 'sm', intent: 'neutral-outline' })}>Go back to the homepage</a>
              </Link>
            </section>
          )}
          {queryAudioChatMetadata?.data?.description?.trim()?.length > 0 && (
            <section className="-mx-6 pt-8 px-6 animate-appear">
              <h2 className="sr-only">About</h2>
              <p className="text-md text-neutral-12">{queryAudioChatMetadata?.data?.description}</p>
            </section>
          )}
        </main>
      </div>
      <DialogGoLive stateTxUi={stateTxUiRallyGoLive} stateGoLiveAudioChat={stateGoLive} />
      <DialogEndLive stateTxUi={stateTxUiEndLiveRally} stateEndLiveAudioChat={stateEndLiveAudioChat} />
    </>
  )
}

export default Page
