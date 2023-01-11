import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useGetAudioChatById } from '@hooks/useGetAudioChatById'
import { IconSpinner } from '@components/Icons'
import { ROUTE_HOME, ROUTE_RALLY_PUBLISH_RECORDING } from '@config/routes'
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import button from '@components/Button/styles'
import { ArrowLeftIcon, ChevronDownIcon, LockOpenIcon, PlayIcon } from '@heroicons/react/20/solid'
import Button from '@components/Button'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import CountdownOpening from '@components/pages/rally/[idRally]/CountdownOpening'
import { isFuture } from 'date-fns'
import { useGoLiveAudioChat, useStoreTxUiGoLiveRally } from '@hooks/useGoLiveAudioChat'
import { useGetGuildMembershipsByWalletAddress } from '@hooks/useGetGuildMembershipsByWalletAddress'
import DialogGoLive from '@components/DialogGoLive'
import { useStoreLiveVoiceChat, useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import StageLiveVoiceChat from '@components/pages/rally/[idRally]/StageLiveVoiceChat'
import CardGuild from '@components/pages/rally/[idRally]/CardGuild'
import HostProfile from '@components/pages/rally/[idRally]/HostProfile'
import FormJoinRoomAs from '@components/pages/rally/[idRally]/FormJoinRoomAs'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import useGetAudioChatPublishedRecording from '@hooks/useGetAudioChatPublishedRecording'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import PublishedRecordingLensPublication from '@components/pages/rally/[idRally]/PublishedRecordingLensPublication'
import PublishedRecordingAbout from '@components/pages/rally/[idRally]/PublishedRecordingAbout'
import DecryptGatedContent from '@components/DecryptGatedContent'
import { Disclosure } from '@headlessui/react'

const Page: NextPage = () => {
  const {
    query: { idRally },
    isReady,
  } = useRouter()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: session } = useSession()
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(idRally as `0x${string}`)
  const queryCurrentUserGuildMemberships = useGetGuildMembershipsByWalletAddress(address as `0x${string}`, {
    enabled: address && queryAudioChatMetadata?.data?.access_control?.guilds?.length > 0 ? true : false,
  })
  const {
    queryPublishedRecording,
    queryDecryptPublishedRecording,
    mutationDecryptMetadata,
    mutationSignDecryptMetadataMessage,
  } = useGetAudioChatPublishedRecording(idRally as `0x${string}`, queryAudioChatMetadata?.data?.recording)
  const stateTxUiRallyGoLive = useStoreTxUiGoLiveRally()
  const { onClickGoLive, stateGoLive } = useGoLiveAudioChat(stateTxUiRallyGoLive)
  const setAudioPlayer = useAudioPlayer((state: any) => state.setAudioPlayer)
  const playedRally = useAudioPlayer((state: any) => state.rally)
  const stateVoiceChat: any = useStoreLiveVoiceChat()
  const rally = useStoreCurrentLiveRally((state: any) => state.rally)
  const setIsSignedIn = useStoreHasSignedInWithLens((state) => state.setIsSignedIn)
  const { disconnect } = useDisconnect()

  return (
    <>
      <Head>
        <title>
          {' '}
          {/* @ts-ignore */}
          {queryAudioChatByIdRawData?.data?.audio_event_id ===
          '0x0000000000000000000000000000000000000000000000000000000000000000'
            ? 'Not found'
            : queryAudioChatMetadata?.data?.name ?? 'Tune in !'}{' '}
          - Rally
        </title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <>
        <div className="overflow-hidden px-6 pb-8 pt-1 -mt-8 -mx-6">
          <nav>
            <Link href={ROUTE_HOME}>
              <a className={button({ intent: 'neutral-ghost', scale: 'sm' })}>
                <ArrowLeftIcon className="w-5 mie-1ex" />
                Back
              </a>
            </Link>
          </nav>
        </div>
        {!queryAudioChatMetadata?.data ? (
          <>
            {!isReady ||
              queryAudioChatByIdRawData?.status === 'loading' ||
              (queryAudioChatMetadata?.status === 'loading' &&
                //@ts-ignore
                queryAudioChatByIdRawData?.data?.audio_event_id !==
                  '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                  <main className="mx-auto pt-8 px-6 animate-appear flex items-center space-i-1ex">
                    <IconSpinner className="animate-spin text-md " />
                    <p className="font-medium animate-pulse">Loading rally...</p>
                  </main>
                ))}
            {/* @ts-ignore */}
            {queryAudioChatByIdRawData?.data?.audio_event_id ===
              '0x0000000000000000000000000000000000000000000000000000000000000000' && (
              <main className="animate-appear">
                <h2 className="text-3xl mb-4 font-bold">Rally not found.</h2>
                <p className="mb-8">This rally doesn't exist or was deleted by its creator.</p>
                <Link href={ROUTE_HOME}>
                  <a className={button({ scale: 'sm', intent: 'neutral-outline' })}>Go back to the homepage</a>
                </Link>
              </main>
            )}
          </>
        ) : (
          <>
            {stateVoiceChat?.room?.state && rally?.id === idRally && stateVoiceChat?.room?.state === 'connected' ? (
              <div className="animate-appear h-full">
                {/* @ts-ignore */}
                <div className="pb-8 flex gap-4 flex-col 2xs:flex-row leading-loose -mis-8 -mie-6 pis-8 pie-6 border-neutral-4 border-b">
                  {queryAudioChatMetadata?.data?.image && (
                    <div className="relative overflow-hidden w-full 2xs:w-36 aspect-twitter-banner 2xs:aspect-square rounded-md">
                      <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
                      <img
                        alt=""
                        loading="lazy"
                        width="128px"
                        height="128px"
                        src={`https://ipfs.io/ipfs/${queryAudioChatMetadata.data.image}`}
                        className="relative z-10 block w-full h-full object-cover "
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold">{queryAudioChatMetadata?.data?.name}</h1>
                    {queryAudioChatMetadata?.data?.description && (
                      <p className="leading-wide text-neutral-11">{queryAudioChatMetadata?.data?.description}</p>
                    )}
                  </div>
                </div>
                <div className="px-6 xs:px-8 h-full flex flex-col pt-6">
                  <StageLiveVoiceChat
                    roomStatus={stateVoiceChat?.room?.state}
                    participants={stateVoiceChat?.participants}
                    isCurrentRally={rally?.id === idRally}
                  />
                </div>
              </div>
            ) : (
              <>
                <main className="h-full flex flex-col animate-appear items-center justify-center">
                  <article className="w-full max-w-[24rem]">
                    <header>
                      <h1 className="text-center text-lg flex flex-col pb-4 leading-relaxed items-center justify-center font-bold">
                        <span className="order-[2]">{queryAudioChatMetadata?.data?.name}</span>
                        <span className="order-[1] text-xs text-neutral-12 uppercase font-semibold">
                          {queryAudioChatMetadata?.data?.state}
                        </span>
                        <div className="flex flex-col items-center mt-2 gap-1 text-2xs order-[3]">
                          {queryAudioChatMetadata?.data?.language && (
                            <mark className="bg-transparent text-neutral-11 order-[3]">
                              {/* @ts-ignore */}
                              {DICTIONARY_LOCALES_SIMPLIFIED?.[queryAudioChatMetadata?.data?.language]}
                            </mark>
                          )}
                          {queryAudioChatMetadata?.data?.category && (
                            <mark className="bg-neutral-1 text-2xs text-neutral-12 py-0.5 px-2 rounded-md font-medium">
                              {/* @ts-ignore */}
                              {DICTIONARY_PROFILE_INTERESTS?.[queryAudioChatMetadata?.data?.category]?.label ??
                                // @ts-ignore
                                DICTIONARY_PROFILE_INTERESTS_CATEGORIES?.[queryAudioChatMetadata?.data?.category]}
                            </mark>
                          )}
                        </div>
                      </h1>
                    </header>
                    <div className="bg-neutral-1 pb-6 border rounded-md border-neutral-4">
                      <section className="flex flex-col">
                        {queryAudioChatMetadata?.data?.image && (
                          <div className="mt-9 mx-auto relative overflow-hidden w-32 aspect-square rounded-t-md xs:rounded-b-md">
                            <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
                            <img
                              alt=""
                              loading="lazy"
                              width="128px"
                              height="128px"
                              src={`https://ipfs.io/ipfs/${queryAudioChatMetadata.data.image}`}
                              className="relative z-10 block w-full h-full object-cover "
                            />
                          </div>
                        )}

                        {queryAudioChatMetadata?.data?.description && (
                          <p className="px-6 text-center italic text-neutral-12 mt-6">
                            {queryAudioChatMetadata?.data?.description}
                          </p>
                        )}

                        <div className="px-6 xs:px-8 text-2xs flex flex-col text-neutral-12 pt-6">
                          <span className="font-medium text-center text-[0.75rem]">Hosted by</span>
                          <ul className="flex flex-wrap justify-center mt-4 gap-6">
                            <li>
                              <HostProfile address={queryAudioChatMetadata?.data?.creator} />
                            </li>
                            {queryAudioChatMetadata?.data?.cohosts_list?.map(
                              (cohost: { eth_address: `0x${string}` }) => (
                                <li key={`cohost-${cohost?.eth_address}`} className="text-start">
                                  <HostProfile address={cohost?.eth_address} />
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </section>
                      {queryAudioChatMetadata?.data?.tags?.length > 0 && (
                        <section className="px-6 xs:px-8 flex flex-col mt-6">
                          {queryAudioChatMetadata?.data?.tags?.length > 0 && (
                            <ul className="mx-auto text-2xs flex justify-center flex-wrap gap-2">
                              {queryAudioChatMetadata?.data?.tags.map((tag: string, key: number) => (
                                <li
                                  className="bg-neutral-3 text-neutral-12 rounded-md px-3 py-0.5 font-semibold text-medium"
                                  key={`${queryAudioChatMetadata?.data?.id_rally}_${key}`}
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          )}
                        </section>
                      )}
                      <section className=" animate-appear border-t border-neutral-4 pt-4 mt-6">
                        {queryAudioChatMetadata?.data?.is_gated === true ||
                        queryAudioChatMetadata?.data?.access_control?.guilds?.length > 0 ? (
                          <div className="px-6 xs:px-8 animate-appear">
                            <p className="pb-8 animate-appear font-semibold text-center text-xs">
                              This rally can only be joined by :{' '}
                            </p>
                            <ul className="space-y-10">
                              {queryAudioChatMetadata?.data?.access_control?.guilds?.map((guild: any) => (
                                <li className="animate-appear relative" key={`guild-${guild.guild_id}`}>
                                  <CardGuild guild={guild} />
                                  <a
                                    className="absolute inset-0 block w-full h-full z-10 opacity-0"
                                    target="_blank"
                                    href={`https://guild.xyz/${guild.guild_id}`}
                                  >
                                    View guild page
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="px-6 xs:px-8 font-semibold text-center text-xs">Anyone can join</p>
                        )}
                        {([
                          DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                          DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                          DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
                        ].includes(queryAudioChatMetadata.data?.state) ||
                          (queryAudioChatMetadata?.data?.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label &&
                            stateVoiceChat?.room?.state === 'disconnected')) && (
                          <div
                            className={`${
                              [
                                DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
                                DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                              ].includes(queryAudioChatMetadata.data.state)
                                ? 'pt-6'
                                : ''
                            } mt-4 border-t border-neutral-4 px-6 xs:px-8 flex flex-col`}
                          >
                            {[
                              DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                              DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                              DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
                            ].includes(queryAudioChatMetadata.data?.state) && (
                              <>
                                {queryAudioChatMetadata?.data?.state === DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label &&
                                  (isFuture(queryAudioChatMetadata?.data?.datetime_start_at) ?? false) && (
                                    <>
                                      {(rally?.id !== idRally ||
                                        (rally?.id === idRally &&
                                          (!stateVoiceChat?.room ||
                                            stateVoiceChat?.room?.state === 'disconnected'))) && (
                                        <>
                                          <div className="animate-appear mx-auto">
                                            <CountdownOpening
                                              startsAt={queryAudioChatMetadata?.data?.datetime_start_at}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}

                                {address === queryAudioChatMetadata?.data?.creator && (
                                  <div className="animate-appear mt-5 flex flex-col justify-center">
                                    {DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label ===
                                      queryAudioChatMetadata.data.state && (
                                      <>
                                        <Button
                                          disabled={rally && rally?.id !== idRally}
                                          onClick={async () => {
                                            stateTxUiRallyGoLive.setDialogVisibility(true)
                                            await onClickGoLive(queryAudioChatMetadata.data?.id)
                                          }}
                                        >
                                          Start live
                                        </Button>
                                        {rally && rally?.id !== idRally && (
                                          <p className="animate-appear text-center text-2xs text-neutral-11 pt-4">
                                            You're already in a rally - finish/leave it first!
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                                {DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label === queryAudioChatMetadata.data.state && (
                                  <div
                                    className={`${
                                      queryAudioChatMetadata?.data?.creator === address ? 'pt-2' : 'pt-4'
                                    } gap-3 flex flex-col justify-center items-center`}
                                  >
                                    {queryAudioChatMetadata.data.will_be_recorded === false ? (
                                      <p className="italic text-neutral-11 text-sm">No recordings available.</p>
                                    ) : (
                                      <>
                                        {queryAudioChatMetadata?.data?.creator === address ? (
                                          <>
                                            <Link
                                              href={ROUTE_RALLY_PUBLISH_RECORDING.replace(
                                                '[idRally]',
                                                queryAudioChatMetadata.data.id,
                                              )}
                                            >
                                              <a
                                                className={button({
                                                  intent: 'primary-ghost',
                                                  scale: 'sm',
                                                })}
                                              >
                                                Update recording
                                              </a>
                                            </Link>
                                          </>
                                        ) : (
                                          <>
                                            {/* @ts-ignore */}
                                            {queryAudioChatByIdRawData?.data?.recording_arweave_transaction_id ===
                                              '' && (
                                              <p className="italic text-neutral-11 text-sm">
                                                The creator didn't publish any recording yet.
                                              </p>
                                            )}
                                          </>
                                        )}

                                        {/* @ts-ignore */}
                                        {queryPublishedRecording?.isLoading &&
                                          //@ts-ignore
                                          queryAudioChatByIdRawData?.data?.recording_arweave_transaction_id !== '' && (
                                            <div className="mb-6 flex items-center justify-center space-i-1ex">
                                              <IconSpinner className="text-xs animate-spin" />
                                              <p className="font-bold animate-pulse">Loading recording...</p>
                                            </div>
                                          )}

                                        {queryPublishedRecording?.isSuccess && (
                                          <>
                                            {queryPublishedRecording?.data?.recording_file ||
                                            queryDecryptPublishedRecording?.data?.recording_file ? (
                                              <>
                                                <Button
                                                  disabled={
                                                    stateVoiceChat?.room.state === 'connected' ||
                                                    playedRally?.id === idRally
                                                  }
                                                  intent={
                                                    stateVoiceChat?.room.state === 'connected' ||
                                                    playedRally?.id === idRally
                                                      ? 'neutral-ghost'
                                                      : 'interactive-outline'
                                                  }
                                                  onClick={() => {
                                                    setAudioPlayer({
                                                      isOpen: true,
                                                      trackSrc:
                                                        queryPublishedRecording?.data?.recording_file ??
                                                        queryDecryptPublishedRecording?.data?.recording_file,
                                                      rally: {
                                                        clickedAt: new Date(),
                                                        timestamp: 0,
                                                        name:
                                                          queryPublishedRecording?.data?.name ??
                                                          queryDecryptPublishedRecording?.data?.name,
                                                        imageSrc:
                                                          queryPublishedRecording?.data?.image ??
                                                          queryDecryptPublishedRecording?.data?.image,
                                                        id: idRally,
                                                        //@ts-ignore
                                                        lensPublicationId:
                                                          queryAudioChatMetadata?.data?.lens_publication_id,
                                                        metadata:
                                                          queryPublishedRecording?.data ??
                                                          queryDecryptPublishedRecording?.data,
                                                      },
                                                    })
                                                  }}
                                                  scale="sm"
                                                  className="animate-appear !pis-2 !pie-3"
                                                >
                                                  {playedRally?.id === idRally ? (
                                                    <>Playing</>
                                                  ) : (
                                                    <>
                                                      <PlayIcon className="w-5 mie-1ex" />
                                                      Play recording
                                                    </>
                                                  )}
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                {queryPublishedRecording?.data?.encrypted === true &&
                                                  !queryDecryptPublishedRecording?.data && (
                                                    <>
                                                      <div className="gap-4 flex flex-col w-full  border-neutral-4 rounded-md">
                                                        <Button
                                                          disabled={
                                                            !address ||
                                                            mutationDecryptMetadata?.isLoading ||
                                                            (mutationDecryptMetadata?.isSuccess &&
                                                              queryDecryptPublishedRecording?.isLoading)
                                                          }
                                                          isLoading={mutationDecryptMetadata?.isLoading}
                                                          onClick={async () =>
                                                            await mutationDecryptMetadata.mutateAsync()
                                                          }
                                                          scale="sm"
                                                          intent="interactive-outline"
                                                          className={'mx-auto !pis-4 !pie-2 animate-appear'}
                                                        >
                                                          {mutationDecryptMetadata?.isError ||
                                                          mutationSignDecryptMetadataMessage?.isError
                                                            ? 'Try again'
                                                            : mutationSignDecryptMetadataMessage
                                                            ? 'Decrypt'
                                                            : mutationDecryptMetadata?.isLoading
                                                            ? 'Decrypting...'
                                                            : mutationDecryptMetadata?.isSuccess &&
                                                              mutationDecryptMetadata?.data?.decryptedString &&
                                                              queryDecryptPublishedRecording?.isLoading &&
                                                              address
                                                            ? 'Loading recording...'
                                                            : 'Decrypt'}
                                                          <LockOpenIcon className="mis-1ex w-4" />
                                                        </Button>
                                                        <p className="text-neutral-11 text-[0.8rem] xs:text-center">
                                                          This recording is gated. <br /> To gain access, your wallet
                                                          must meet the following criteria :
                                                        </p>
                                                        {queryPublishedRecording?.data?.accessControlConditions
                                                          ?.length > 3 ? (
                                                          <>
                                                            <Disclosure>
                                                              <Disclosure.Button className="font-bold flex items-center justify-center border-neutral-4 w-full text-2xs">
                                                                Conditions <ChevronDownIcon className="mis-3 w-4" />
                                                              </Disclosure.Button>
                                                              <Disclosure.Panel>
                                                                <ul>
                                                                  {queryPublishedRecording?.data?.accessControlConditions?.map(
                                                                    (condition: any, i: any) => {
                                                                      if (condition?.operator) {
                                                                        return (
                                                                          <li
                                                                            className="text-center py-2 font-bold text-[0.65rem] uppercase text-neutral-11"
                                                                            key={`operator-${condition.operator}-${i}`}
                                                                          >
                                                                            {condition.operator}
                                                                          </li>
                                                                        )
                                                                      }
                                                                      return (
                                                                        <li
                                                                          className="bg-neutral-2 border border-neutral-4 p-3 rounded-md"
                                                                          key={`condition-${i}-${condition?.chain}-${condition?.standardContractType}-${condition?.contractAddress}`}
                                                                        >
                                                                          <DecryptGatedContent condition={condition} />
                                                                        </li>
                                                                      )
                                                                    },
                                                                  )}
                                                                </ul>
                                                              </Disclosure.Panel>
                                                            </Disclosure>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <ul>
                                                              {queryPublishedRecording?.data?.accessControlConditions?.map(
                                                                (condition: any, i: any) => {
                                                                  if (condition?.operator) {
                                                                    return (
                                                                      <li
                                                                        className="text-center py-2 font-bold text-[0.65rem] uppercase text-neutral-11"
                                                                        key={`operator-${condition.operator}-${i}`}
                                                                      >
                                                                        {condition.operator}
                                                                      </li>
                                                                    )
                                                                  }
                                                                  return (
                                                                    <li
                                                                      className="bg-neutral-2 border border-neutral-4 p-3 rounded-md"
                                                                      key={`condition-${i}-${condition?.chain}-${condition?.standardContractType}-${condition?.contractAddress}`}
                                                                    >
                                                                      <DecryptGatedContent condition={condition} />
                                                                    </li>
                                                                  )
                                                                },
                                                              )}
                                                            </ul>
                                                          </>
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                            {queryAudioChatMetadata?.data?.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label && (
                              <>
                                {!address ? (
                                  <>
                                    <Button onClick={openConnectModal}>Connect first</Button>
                                  </>
                                ) : chain?.unsupported || chain?.id === 1 ? (
                                  <Button onClick={openChainModal}>Switch chain first</Button>
                                ) : !session ? (
                                  <>
                                    <Button
                                      onClick={async () => {
                                        setIsSignedIn(false)
                                        await disconnect()
                                        //@ts-ignore
                                        openConnectModal()
                                      }}
                                    >
                                      Verify first
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {stateVoiceChat?.room?.state === 'disconnected' && (
                                      <>
                                        {queryAudioChatMetadata?.data?.access_control?.guilds?.length === 0 ||
                                        queryAudioChatMetadata?.data?.access_control?.whitelist.includes(address) ||
                                        queryAudioChatMetadata?.data?.guests_list.includes(address) ? (
                                          <>
                                            <FormJoinRoomAs
                                              stateVoiceChat={stateVoiceChat}
                                              rallyJoined={rally}
                                              idRallyToJoin={`${idRally}`}
                                              dataAudioChat={queryAudioChatMetadata?.data}
                                            />
                                            <p className="text-center text-neutral-11 pt-3 text-2xs">
                                              Your mic will be muted when you join.
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            {queryCurrentUserGuildMemberships?.isLoading ? (
                                              <p className="animate-pulse font-bold text-2xs">
                                                Checking your membership...
                                              </p>
                                            ) : queryCurrentUserGuildMemberships?.isError ? (
                                              <p className="animate-appear">
                                                Something went wrong while checking your Guild memberships.
                                              </p>
                                            ) : (
                                              <>
                                                {[]
                                                  .concat(
                                                    ...queryAudioChatMetadata?.data?.access_control?.guilds.map(
                                                      (guild: any) => guild.roles,
                                                    ),
                                                  )
                                                  .filter((role) =>
                                                    queryCurrentUserGuildMemberships?.data?.roles.includes(
                                                      //@ts-ignore
                                                      parseInt(role),
                                                    ),
                                                  )?.length > 0 ? (
                                                  <>
                                                    <FormJoinRoomAs
                                                      stateVoiceChat={stateVoiceChat}
                                                      rallyJoined={rally}
                                                      idRallyToJoin={`${idRally}`}
                                                      dataAudioChat={queryAudioChatMetadata?.data}
                                                    />
                                                    <p className="text-center text-neutral-11 pt-3 text-2xs">
                                                      Your mic will be muted when you join.
                                                    </p>
                                                  </>
                                                ) : (
                                                  <div className="animate-appear text-2xs text-center">
                                                    <p className="font-semibold mb-2  text-neutral-11">
                                                      Your wallet doesn't qualify to join this rally.
                                                    </p>
                                                    <p className="font-bold mb-4">
                                                      Try to join one of the allowed guild and claim one of the roles on{' '}
                                                      <span className="font-bold">Guild</span> to qualify.
                                                    </p>
                                                    <a
                                                      target="_blank"
                                                      className={button({
                                                        intent: 'neutral-outline',
                                                        scale: 'sm',
                                                        class: 'w-full',
                                                      })}
                                                      href={`https://guild.xyz`}
                                                    >
                                                      Explore and join guilds
                                                    </a>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </section>
                    </div>
                    {![
                      DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label,
                      DICTIONARY_STATES_AUDIO_CHATS?.FINISHED.label,
                    ].includes(queryAudioChatMetadata?.data?.state) && (
                      <footer className="pt-4 animate-appear">
                        <p className="text-2xs text-center text-neutral-9">
                          Max. {queryAudioChatMetadata?.data?.max_attendees ?? 100} attendees
                        </p>
                      </footer>
                    )}
                  </article>
                  {((queryAudioChatMetadata?.isSuccess &&
                    //@ts-ignore
                    queryPublishedRecording?.data?.encrypted !== true &&
                    queryPublishedRecording?.data?.metadata) ||
                    (queryPublishedRecording?.data?.encrypted === true && queryDecryptPublishedRecording?.data)) && (
                    <div className="mt-8 w-full animate-appear text-center">
                      <header className="py-3 border-b px-3 md:px-6 -mx-3 md:-mx-6 border-neutral-4 text-neutral-10 text-2xs">
                        Published on Rally
                      </header>
                      <PublishedRecordingAbout
                        publication={
                          queryPublishedRecording?.data?.encrypted === true
                            ? { metadata: queryDecryptPublishedRecording?.data }
                            : queryPublishedRecording?.data
                        }
                      />
                    </div>
                  )}
                  {/* @ts-ignore */}
                  {queryAudioChatMetadata?.isSuccess && queryAudioChatByIdRawData?.data?.lens_publication_id !== '' && (
                    <PublishedRecordingLensPublication
                      initialContent={queryAudioChatMetadata?.data?.description}
                      //@ts-ignore
                      idLensPublication={queryAudioChatByIdRawData?.data?.lens_publication_id}
                      idRally={idRally as string}
                    />
                  )}
                </main>
              </>
            )}
          </>
        )}
      </>
      <DialogGoLive stateTxUi={stateTxUiRallyGoLive} stateGoLiveAudioChat={stateGoLive} />
    </>
  )
}

export default Page
