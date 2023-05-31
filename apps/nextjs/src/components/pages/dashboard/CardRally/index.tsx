import BadgeRallyState from '@components/BadgeRallyState'
import Button from '@components/Button'
import button from '@components/Button/styles'
import { ROUTE_RALLY_VIEW, ROUTE_RALLY_EDIT, ROUTE_RALLY_PUBLISH_RECORDING } from '@config/routes'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import {
  ArrowDownTrayIcon,
  CalendarIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  LockOpenIcon,
  PencilIcon,
  PlayCircleIcon,
  PlayIcon,
  StopCircleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import useGetRecordingPresignedUrl from '@hooks/useGetRecordingPresignedUrl'
import useGetAudioChatPublishedRecording from '@hooks/useGetAudioChatPublishedRecording'
import { formatRelative, format, isFuture } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconSpinner } from '@components/Icons'
import { trpc } from '@utils/trpc'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useAccount } from 'wagmi'
import { useState } from 'react'

interface CardRallyProps {
  data: any
  onClickGoLive: any
  onClickEndLive: any
  onSelectRallyToCancel: any
  onSelectRallyToDelete: any
}

export const CardRally = (props: CardRallyProps) => {
  const { data, onSelectRallyToDelete, onSelectRallyToCancel, onClickEndLive, onClickGoLive } = props
  const { push } = useRouter()
  const account = useAccount()
  const playedRally = useAudioPlayer((state: any) => state.rally)
  const stateVoiceChat: any = useStoreLiveVoiceChat()
  const {
    queryPublishedRecording,
    mutationSignDecryptMetadataMessage,
    mutationDecryptMetadata,
    queryDecryptPublishedRecording,
  } = useGetAudioChatPublishedRecording(data.id, data.recording)
  //@ts-ignore
  const querySessionRecordings: any = trpc.recordings.rally_available_recordings.useQuery(
    {
      id_rally: data?.id,
    },
    {
      enabled:
        data?.recording === '' &&
        data?.will_be_recorded === true &&
        [
          DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
          DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
          //@ts-ignore
        ].includes(data.state),
    },
  )

  const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)
  const mutationPlaySessionRecording = useGetRecordingPresignedUrl({})

  const mutationDownloadRecording = useGetRecordingPresignedUrl({
    onSuccess(mutationData: any) {
      const url = mutationData
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `recording.ogg`)
      document.body.appendChild(link)
      link.click()
      //@ts-ignore
      link.parentNode.removeChild(link)
    },
  })
  const [isPlayingRoomSession, setIsPlayingRoomSession] = useState(false)
  return (
    <div
      className={`focus-within:ring-4 focus-within:ring-interactive-11 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1`}
    >
      <Link
        className="absolute z-10 inset-0 w-full h-full opacity-0"
        href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}
      >
        View page
      </Link>
      <div className="xs:pt-2 xs:pis-2 xs:pie-4">
        <article
          className={`${
            data.state === DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label ? 'opacity-50' : ''
          } flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6`}
        >
          {data?.image && (
            <div className="shrink-0 relative pointer-events-none w-full overflow-hidden max-h-48 xs:max-w-unset xs:w-32 xs:aspect-square h-full lg:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
              <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
              <img
                alt=""
                loading="lazy"
                width="128px"
                height="86px"
                src={`https://demo-letsrally.infura-ipfs.io/ipfs/${data.image}`}
                className="relative z-10 block w-full h-full object-cover "
              />
            </div>
          )}

          <div className={`${!data?.image ? 'pt-4 md:pt-0 ' : ''} px-4 flex-grow flex flex-col xs:px-0`}>
            {' '}
            <h1 className="font-bold flex flex-col-reverse">
              <span className="py-2">{data.name}</span>
              <div className="flex gap-3 items-center">
                <BadgeRallyState state={data.state} />

                {!data?.is_indexed && <span className="font-medium text-2xs text-neutral-11">🕵️ Unindexed</span>}
              </div>
            </h1>
            {data.state === DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label && (
              <>
                <p className="mt-2 font-medium flex flex-wrap items-baseline text-neutral-12 text-xs">
                  <CalendarIcon className="translate-y-1 opacity-90 shrink-0 w-5 mie-2" />
                  {formatRelative(data.datetime_start_at, new Date())}

                  <span>&nbsp;({format(data.datetime_start_at, 'ppp')})</span>
                </p>
              </>
            )}
            <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
              {data.is_gated ? 'Gated access' : 'Free access'}
            </p>
            <p className="text-neutral-11 text-2xs mt-2">{data.cohosts_list.length} cohosts</p>
          </div>
        </article>
        <div className="relative z-20">
          <Disclosure>
            <div className="flex flex-col 2xs:flex-row gap-4 xs:gap-3 items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
              {[
                DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                //@ts-ignore
              ].includes(data.state) &&
                isFuture(data.datetime_start_at) && (
                  <Button onClick={onClickGoLive} scale="sm" className="w-auto relative z-10">
                    Go live
                  </Button>
                )}

              {data.state === DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label && data.will_be_recorded === true && (
                <>
                  {data?.recording === '' ? (
                    <>
                      <Link
                        className={button({
                          intent: 'primary-outline',
                          scale: 'sm',
                          class: 'w-auto',
                        })}
                        href={ROUTE_RALLY_PUBLISH_RECORDING.replace('[idRally]', data.id)}
                      >
                        Publish recording
                      </Link>
                    </>
                  ) : (
                    <>
                      {(queryPublishedRecording?.data || queryDecryptPublishedRecording?.data) && (
                        <>
                          {queryPublishedRecording?.data?.recording_file ||
                          queryDecryptPublishedRecording?.data?.recording_file ? (
                            <>
                              <Button
                                disabled={stateVoiceChat?.room?.state === 'connected' || playedRally?.id === data?.id}
                                intent={
                                  stateVoiceChat?.room?.state === 'connected' || playedRally?.id === data?.id
                                    ? 'neutral-ghost'
                                    : 'interactive-outline'
                                }
                                onClick={() => {
                                  const recording =
                                    queryPublishedRecording?.data?.encrypted !== true
                                      ? queryPublishedRecording?.data
                                      : queryDecryptPublishedRecording?.data
                                  setAudioPlayer({
                                    isOpen: true,
                                    trackSrc: recording?.recording_file,
                                    rally: {
                                      clickedAt: new Date(),
                                      timestamp: 0,
                                      name: recording?.name,
                                      imageSrc: recording?.image,
                                      id: data?.id,
                                      //@ts-ignore
                                      lensPublicationId: data?.lens_publication_id,
                                      metadata: recording,
                                    },
                                  })
                                }}
                                scale="sm"
                                className="!pis-2 animate-appear !pie-3"
                              >
                                {playedRally?.id === data?.id ? (
                                  <>Playing</>
                                ) : (
                                  <>
                                    <PlayIcon className="w-5 mie-1ex" />
                                    Play
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <>
                              {queryPublishedRecording?.data?.encrypted === true && (
                                <>
                                  <Button
                                    disabled={!account?.address || mutationDecryptMetadata?.isLoading}
                                    isLoading={mutationDecryptMetadata?.isLoading}
                                    onClick={async () => await mutationDecryptMetadata.mutateAsync()}
                                    scale="sm"
                                    intent="interactive-outline"
                                    className={'2xs:w-fit-content relative z-20 !pis-4 !pie-2 animate-appear'}
                                  >
                                    {mutationDecryptMetadata?.isError || mutationSignDecryptMetadataMessage?.isError
                                      ? 'Try again'
                                      : mutationSignDecryptMetadataMessage.isIdle
                                      ? 'Decrypt'
                                      : mutationDecryptMetadata?.isLoading
                                      ? 'Decrypting...'
                                      : mutationDecryptMetadata?.isSuccess &&
                                        //@ts-ignore
                                        mutationDecryptMetadata?.decryptedString &&
                                        queryDecryptPublishedRecording?.isLoading &&
                                        account?.address
                                      ? 'Loading recording...'
                                      : 'Decrypt'}
                                    <LockOpenIcon className="mis-1ex w-4" />
                                  </Button>
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

              {data.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label && (
                <Button onClick={onClickEndLive} intent="primary-outline" scale="sm" className="w-auto">
                  End live
                </Button>
              )}

              <div className="mx-auto 2xs:mie-0 flex items-center flex-wrap gap-2">
                <>
                  {querySessionRecordings?.data?.length > 0 && (
                    <>
                      <Disclosure.Button
                        className={button({
                          intent: 'primary-ghost',
                          scale: 'xs',
                          class: 'animate-appear md:!pis-2 md:!pie-4  w-auto space-i-2 inline-flex',
                        })}
                      >
                        <ArrowDownTrayIcon className="w-5 mie-2" />
                        {querySessionRecordings?.data?.length}&nbsp;
                        <span className="sr-only xs:not-sr-only md:sr-only lg:not-sr-only">
                          available file
                          {/* @ts-ignore */}
                          {querySessionRecordings?.data?.length > 1 ? 's' : ''}
                        </span>
                      </Disclosure.Button>
                    </>
                  )}
                  {/** @ts-ignore */}
                  {(![DICTIONARY_STATES_AUDIO_CHATS.LIVE.label].includes(data.state) ||
                    ([
                      DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                      DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                      //@ts-ignore
                    ].includes(data.state) &&
                      isFuture(data.datetime_start_at))) && (
                    <Menu as="div" className="text-2xs">
                      <Menu.Button
                        className={button({
                          intent: 'neutral-ghost',
                          scale: 'xs',
                          class: 'ui-open:bg-opacity-10 rounded-md',
                        })}
                      >
                        <span className="sr-only lg:not-sr-only">More</span>
                        <EllipsisHorizontalIcon className="mis-2 w-5" />
                      </Menu.Button>
                      <Menu.Items className="z-20 absolute flex flex-col w-full  xs:w-max-content inline-end-0 mt-2 origin-top-right divide-y border-neutral-6 border divide-neutral-4 rounded-md overflow-hidden bg-neutral-3 focus:outline-none">
                        {[
                          DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                          DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                          //@ts-ignore
                        ].includes(data.state) &&
                          isFuture(data.datetime_start_at) && (
                            <>
                              <Menu.Item
                                as="button"
                                className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                                onClick={() => push(ROUTE_RALLY_EDIT.replace('[idRally]', data.id))}
                              >
                                <PencilIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                                Edit
                              </Menu.Item>
                            </>
                          )}
                        {[
                          DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                          DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                          //@ts-ignore
                        ].includes(data.state) && (
                          <>
                            <Menu.Item
                              className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                              as="button"
                              onClick={onSelectRallyToCancel}
                            >
                              <ExclamationCircleIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                              Cancel
                            </Menu.Item>
                          </>
                        )}
                        {data?.recording !== '' && (
                          <Menu.Item
                            className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                            as={Link}
                            href={ROUTE_RALLY_PUBLISH_RECORDING.replace('[idRally]', data.id)}
                          >
                            <PencilIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                            Update published recording
                          </Menu.Item>
                        )}
                        {/* @ts-ignore */}
                        {![DICTIONARY_STATES_AUDIO_CHATS.LIVE.label].includes(data.state) && (
                          <Menu.Item
                            className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:text-neutral-1 ui-active:bg-neutral-12 font-bold"
                            as="button"
                            onClick={onSelectRallyToDelete}
                          >
                            <TrashIcon className="w-4 mie-1ex ui-active:text-negative-9" />
                            Delete forever
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Menu>
                  )}
                </>
              </div>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="flex relative z-20 flex-col gap-8 items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
                {/* @ts-ignore */}
                {querySessionRecordings?.data?.length > 0 && (
                  <ul className="w-full gap-4 flex flex-col">
                    {querySessionRecordings?.data?.map((recording: any) => {
                      return (
                        <li
                          className="relative z-20 bg-neutral-5 animate-appear delay-75 pis-4 py-1 pie-1 rounded-full text-2xs flex justify-between items-center"
                          key={`rally-session-recording${data.id}-${recording?.name}`}
                        >
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={async () => {
                                if (!isPlayingRoomSession) {
                                  mutationPlaySessionRecording.mutateAsync(
                                    {
                                      id_rally: data?.id,
                                      filename: recording?.name,
                                    },
                                    {
                                      onSuccess(recordingUrl: string) {
                                        setIsPlayingRoomSession(true)
                                        setAudioPlayer({
                                          isOpen: true,
                                          trackSrc: recordingUrl,
                                          rally: {
                                            clickedAt: new Date(),
                                            timestamp: 0,
                                            name: `${data?.name} - ${recording?.name}`,
                                            imageSrc: data?.image,
                                            id: data?.id,
                                          },
                                        })
                                      },
                                    },
                                  )
                                } else {
                                  setIsPlayingRoomSession(false)
                                  setAudioPlayer({
                                    isOpen: false,
                                    trackSrc: undefined,
                                    rally: undefined,
                                  })
                                }
                              }}
                              disabled={mutationPlaySessionRecording?.isLoading}
                              className="disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            >
                              {mutationPlaySessionRecording?.isLoading ? (
                                <IconSpinner className="animate-spin mie-2" />
                              ) : (
                                <>
                                  {!isPlayingRoomSession ? (
                                    <PlayCircleIcon className="mie-2 w-7" />
                                  ) : (
                                    <StopCircleIcon className="mie-2 w-7" />
                                  )}
                                </>
                              )}
                              <span className="sr-only">Play</span>
                            </button>
                            <span className="font-mono"> {recording?.name}</span>
                          </div>

                          <Button
                            disabled={mutationDownloadRecording.isLoading}
                            isLoading={mutationDownloadRecording.isLoading}
                            onClick={async () => {
                              await mutationDownloadRecording.mutateAsync({
                                id_rally: data?.id,
                                filename: recording?.name,
                              })
                            }}
                            type="button"
                            intent="neutral-on-dark-layer"
                            scale="xs"
                          >
                            Download
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                )}
                <p className="font-medium text-2xs text-neutral-12">
                  Make sure to download your files ! <br /> Rally only stores them for 3 days.
                </p>
              </Disclosure.Panel>
            </Transition>
          </Disclosure>
        </div>
      </div>
    </div>
  )
}
