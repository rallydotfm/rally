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
  PencilIcon,
  PlayCircleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import useGetAudioChatSessionRecording from '@hooks/useGetAudioChatSessionRecordings'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import useGetRecordingPresignedUrl from '@hooks/useGetRecordingPresignedUrl'
import { formatRelative, format, isFuture } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconSpinner } from '@components/Icons'

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
  const querySessionRecordings = useGetAudioChatSessionRecording(data)
  const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)
  const mutationPlayRecording = useGetRecordingPresignedUrl({
    onSuccess(mutationData: any) {
      setAudioPlayer({
        isOpen: true,
        trackSrc: mutationData,
        rally: {
          name: data?.name,
          imageSrc: data?.image,
          id: data?.id,
        },
      })
    },
  })
  return (
    <div
      className={`focus-within:ring-4 focus-within:ring-interactive-11 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1`}
    >
      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}>
        <a className="absolute z-10 inset-0 w-full h-full opacity-0">View page</a>
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
                src={`https://ipfs.io/ipfs/${data.image}`}
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
            <div className="flex flex-col 2xs:flex-row gap-3 items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
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
                <Link href={ROUTE_RALLY_PUBLISH_RECORDING.replace('[idRally]', data.id)}>
                  <a
                    className={button({
                      intent: 'primary-outline',
                      scale: 'sm',
                      class: 'w-auto',
                    })}
                  >
                    Publish recording
                  </a>
                </Link>
              )}

              {data.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label && (
                <Button onClick={onClickEndLive} intent="primary-outline" scale="sm" className="w-auto">
                  End live
                </Button>
              )}

              <div className="mx-auto 2xs:mie-0 flex flex-wrap gap-4">
                <>
                  {[
                    DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
                    DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
                    //@ts-ignore
                  ].includes(data.state) &&
                    data.will_be_recorded &&
                    isFuture(data.datetime_start_at) &&
                    //@ts-ignore
                    querySessionRecordings?.data?.length > 0 && (
                      <>
                        <Disclosure.Button
                          className={button({
                            intent: 'primary-ghost',
                            scale: 'sm',
                            class: 'animate-appear w-auto space-i-2 inline-flex',
                          })}
                        >
                          <ArrowDownTrayIcon className="w-5 mie-2" />
                          {querySessionRecordings?.data?.length} recorded files
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
                        More <EllipsisHorizontalIcon className="mis-2 w-5" />
                      </Menu.Button>
                      <Menu.Items className="absolute flex flex-col w-full  xs:w-max-content inline-end-0 mt-2 origin-top-right divide-y border-neutral-6 border divide-neutral-4 rounded-md overflow-hidden bg-neutral-3 focus:outline-none">
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
              <Disclosure.Panel className="flex relative z-20 flex-col 2xs:flex-row gap-3 items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
                {/* @ts-ignore */}
                {querySessionRecordings?.data?.length > 0 && (
                  <ul className="w-full gap-4 flex flex-col">
                    {querySessionRecordings?.data?.map((recording) => {
                      return (
                        <li
                          className="relative z-20 bg-neutral-5 animate-appear delay-75 pis-4 py-1 pie-1 rounded-full text-2xs flex justify-between items-center"
                          key={recording}
                        >
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={async () => {
                                mutationPlayRecording.mutateAsync({
                                  id_rally: data?.id,
                                  filename: recording,
                                })
                              }}
                              disabled={mutationPlayRecording?.isLoading}
                              className="disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            >
                              {mutationPlayRecording?.isLoading ? (
                                <IconSpinner className="animate-spin mie-2" />
                              ) : (
                                <PlayCircleIcon className="mie-2 w-7" />
                              )}
                              <span className="sr-only">Play</span>
                            </button>
                            <span className="font-mono"> {recording}</span>
                          </div>

                          <Button type="button" intent="neutral-on-dark-layer" scale="xs">
                            Download
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Disclosure.Panel>
            </Transition>
          </Disclosure>
        </div>
      </div>
    </div>
  )
}
