import Button from '@components/Button'
import button from '@components/Button/styles'
import { ROUTE_RALLY_VIEW, ROUTE_RALLY_PUBLISH_RECORDING } from '@config/routes'
import { Menu } from '@headlessui/react'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { EllipsisHorizontalIcon, PencilIcon, PlayIcon, TrashIcon } from '@heroicons/react/20/solid'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import useGetAudioChatPublishedRecording from '@hooks/useGetAudioChatPublishedRecording'
import { isFuture } from 'date-fns'
import Link from 'next/link'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'

interface CardRecordingProps {
  data: any
  onClickGoLive: any
  onClickEndLive: any
  onSelectRallyToCancel: any
  onSelectRallyToDelete: any
}

export const CardRecording = (props: CardRecordingProps) => {
  const { data, onSelectRallyToDelete } = props
  const playedRally = useAudioPlayer((state: any) => state.rally)
  const stateVoiceChat: any = useStoreLiveVoiceChat()
  const {
    queryPublishedRecording,
    queryDecryptPublishedRecording,
    mutationDecryptMetadata,
    mutationSignDecryptMetadataMessage,
  } = useGetAudioChatPublishedRecording(data.id, data.recording)
  const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)

  if (
    (queryPublishedRecording?.isLoading && queryPublishedRecording?.data?.encrypted !== true) ||
    (queryPublishedRecording?.data?.encrypted === true && queryDecryptPublishedRecording?.isLoading)
  )
    return <div className="w-full aspect-video bg-neutral-2 animate-pulse rounded-md"></div>
  return (
    <div
      className={`focus-within:ring-4 focus-within:ring-interactive-11 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1`}
    >
      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}>
        <a className="absolute z-10 inset-0 w-full h-full opacity-0">View page</a>
      </Link>
      <div className="xs:pt-2 xs:pis-2 xs:pie-4">
        <article className={`flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6`}>
          {queryPublishedRecording?.data?.image && (
            <div className="shrink-0 relative pointer-events-none w-full overflow-hidden max-h-48 xs:max-w-unset xs:w-32 xs:aspect-square h-full lg:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
              <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
              <img
                alt=""
                loading="lazy"
                width="128px"
                height="86px"
                src={`https://ipfs.io/ipfs/${queryPublishedRecording?.data?.image}`}
                className="relative z-10 block w-full h-full object-cover "
              />
            </div>
          )}

          <div className={`${!data?.image ? 'pt-4 md:pt-0 ' : ''} px-4 flex-grow flex flex-col xs:px-0`}>
            {' '}
            <h1 className="font-bold flex flex-col-reverse">
              <span className="py-2">{queryPublishedRecording?.data?.name}</span>
              <div className="flex gap-3 items-center">
                {!data?.is_indexed && <span className="font-medium text-2xs text-neutral-11">🕵️ Unindexed</span>}
              </div>
            </h1>
          </div>
        </article>
        <div className="relative z-20">
          <div className="flex flex-col 2xs:flex-row gap-4 xs:gap-3 items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
            <Button
              disabled={stateVoiceChat?.room.state === 'connected' || playedRally?.id === data?.id}
              intent={
                stateVoiceChat?.room.state === 'connected' || playedRally?.id === data?.id
                  ? 'neutral-ghost'
                  : 'interactive-outline'
              }
              onClick={() => {
                setAudioPlayer({
                  isOpen: true,
                  trackSrc: queryPublishedRecording?.data?.recording_file,
                  rally: {
                    clickedAt: new Date(),
                    timestamp: 0,
                    name: queryPublishedRecording?.data?.name,
                    imageSrc: queryPublishedRecording?.data?.image,
                    id: data?.id,
                    //@ts-ignore
                    lensPublicationId: data?.lens_publication_id,
                    metadata: queryPublishedRecording?.data,
                  },
                })
              }}
              scale="sm"
              className="!pis-2 !pie-3"
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

            <div className="mx-auto 2xs:mie-0 flex items-center flex-wrap gap-2">
              <>
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
                      {data?.recording !== '' && (
                        <Menu.Item as={Link} href={ROUTE_RALLY_PUBLISH_RECORDING.replace('[idRally]', data.id)}>
                          <a className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold">
                            <PencilIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                            Update published recording
                          </a>
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
        </div>
      </div>
    </div>
  )
}
