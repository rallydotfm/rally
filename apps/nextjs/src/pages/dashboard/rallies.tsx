import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import useGetAudioChatsByWalletAddress from '@hooks/useGetAudioChatsByWalletAddress'
import { getLayout } from '@layouts/LayoutDashboard'
import Button from '@components/Button'
import Link from 'next/link'
import button from '@components/Button/styles'
import { ROUTE_RALLY_EDIT, ROUTE_RALLY_VIEW } from '@config/routes'
import { IconSpinner } from '@components/Icons'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { CalendarIcon, ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { format, isFuture, formatRelative } from 'date-fns'
import { useState } from 'react'
import { useCancelAudioChat, useStoreTxUiCancelRally } from '@hooks/useCancelAudioChat'
import { useDeleteAudioChat, useStoreTxUiDeleteRally } from '@hooks/useDeleteAudioChat'
import { useGoLiveAudioChat, useStoreTxUiGoLiveRally } from '@hooks/useGoLiveAudioChat'
import { useEndLiveAudioChat, useStoreTxUiEndLiveRally } from '@hooks/useEndLiveAudioChat'

import DialogCancelRallyConfirmation from '@components/DialogCancelRallyConfirmation'
import DialogDeleteRallyConfirmation from '@components/DialogDeleteRallyConfirmation'
import DialogGoLive from '@components/DialogGoLive'
import DialogEndLive from '@components/DialogEndLive'
import BadgeRallyState from '@components/BadgeRallyState'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/router'

const SORT_ORDER = {
  START_CLOSEST: 'start_at.closest',
  START_FURTHEST: 'start_at.furthest',
  CREATED_OLDEST: 'start_at.oldest',
  CREATED_NEWEST: 'start_at.newest',
}
const Page: NextPage = () => {
  const { address } = useAccount()
  const { queryAudioChatsByAddressRawData, queriesAudioChatsByAddressMetadata } =
    useGetAudioChatsByWalletAddress(address)

  const stateTxUiRallyGoLive = useStoreTxUiGoLiveRally()
  const { onClickGoLive, stateGoLive } = useGoLiveAudioChat(stateTxUiRallyGoLive)

  const stateTxUiCancelRally = useStoreTxUiCancelRally()
  const { onClickCancelAudioChat, stateCancelAudioChat } = useCancelAudioChat(stateTxUiCancelRally)
  const stateTxUiDeleteRally = useStoreTxUiDeleteRally()
  const { onClickDeleteAudioChat, stateDeleteAudioChat } = useDeleteAudioChat(
    stateTxUiDeleteRally,
    queryAudioChatsByAddressRawData.refetch,
  )
  const stateTxUiEndLiveRally = useStoreTxUiEndLiveRally()
  const { onClickEndLive, stateEndLiveAudioChat } = useEndLiveAudioChat(stateTxUiEndLiveRally)

  const { push } = useRouter()
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.START_CLOSEST)
  return (
    <>
      <Head>
        <title>Dashboard - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main className="pb-32 h-full">
        {(queryAudioChatsByAddressRawData.isLoading ||
          queriesAudioChatsByAddressMetadata.filter((query) => query?.isLoading)?.length > 0) && (
          <div className="mb-6 flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading your rallies...</p>
          </div>
        )}
        {queryAudioChatsByAddressRawData.status === 'error' && <>Error</>}
        {queryAudioChatsByAddressRawData.status === 'success' && (
          <>
            <div className="mb-6 animate-appear flex justify-between">
              <h2 className="font-medium text-xs text-neutral-11">
                {queriesAudioChatsByAddressMetadata.filter((query) => query?.status === 'success')?.length} rallies
              </h2>
            </div>
            <ul
              className={`${
                queryAudioChatsByAddressRawData.isRefetching ? 'animate-pulse' : ''
              } space-y-8 animate-appear`}
            >
              {queriesAudioChatsByAddressMetadata
                .filter((query) => query?.data?.name)
                /* @ts-ignore */
                .sort((a, b) => {
                  if (sortOrder === SORT_ORDER.START_CLOSEST)
                    return a.data.epoch_time_start_at > b.data.epoch_time_start_at
                  if (sortOrder === SORT_ORDER.START_FURTHEST)
                    return a.data.epoch_time_start_at < b.data.epoch_time_start_at
                  if (sortOrder === SORT_ORDER.CREATED_NEWEST)
                    return a.data.epoch_time_created_at > b.data.epoch_time_created_at
                  if (sortOrder === SORT_ORDER.CREATED_OLDEST)
                    return a.data.epoch_time_created_at < b.data.epoch_time_created_at
                })
                .map((audioChat) => {
                  //@ts-ignore
                  const rawDataState = queryAudioChatsByAddressRawData?.data?.filter(
                    (chat) => chat.audio_event_id === audioChat.data.id,
                  )?.[0].state
                  return (
                    <li
                      className={`animate-appear relative focus-within:z-10 focus-within:ring-4 focus-within:ring-interactive-11 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1`}
                      key={audioChat.data.id}
                    >
                      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', audioChat.data.id)}>
                        <a className="absolute z-10 inset-0 w-full h-full opacity-0">View page</a>
                      </Link>
                      <div className="xs:pt-2 xs:pis-2 xs:pie-4">
                        <article
                          className={`${
                            audioChat.data.state === DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label ? 'opacity-50' : ''
                          } flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6`}
                        >
                          {audioChat?.data?.image && (
                            <div className="relative pointer-events-none w-full overflow-hidden xs:w-32 md:aspect-square lg:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
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
                          )}

                          <div className="px-4 flex-grow flex flex-col xs:px-0">
                            {' '}
                            <h1 className="font-bold flex flex-col-reverse">
                              <span className="py-2">{audioChat.data.name}</span>
                              <BadgeRallyState state={audioChat.data.state} />
                            </h1>
                            {audioChat.data.state === DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label && (
                              <>
                                <p className="mt-2 font-medium flex flex-wrap items-baseline text-neutral-12 text-xs">
                                  <CalendarIcon className="translate-y-1 opacity-90 shrink-0 w-5 mie-2" />
                                  {formatRelative(audioChat.data.datetime_start_at, new Date())}

                                  <span>&nbsp;({format(audioChat.data.datetime_start_at, 'ppp')})</span>
                                </p>
                              </>
                            )}
                            <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                              {audioChat.data.is_gated ? 'Gated access' : 'Free access'}
                            </p>
                            <p className="text-neutral-11 text-2xs mt-2">
                              {audioChat.data.cohosts_list.length} cohosts
                            </p>
                          </div>
                        </article>
                        <div className="flex items-center border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
                          {[
                            DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                            DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                            //@ts-ignore
                          ].includes(audioChat.data.state) &&
                            isFuture(audioChat.data.datetime_start_at) && (
                              <Button
                                onClick={async () => {
                                  stateTxUiRallyGoLive.setDialogVisibility(true)
                                  await onClickGoLive(audioChat.data.id)
                                }}
                                scale="sm"
                                className="w-auto relative z-10"
                              >
                                Go live
                              </Button>
                            )}
                          {audioChat.data.state === DICTIONARY_STATES_AUDIO_CHATS.LIVE.label && (
                            <Button
                              onClick={async () => {
                                stateTxUiEndLiveRally.setDialogVisibility(true)
                                await onClickEndLive(audioChat.data.id)
                              }}
                              intent="primary-outline"
                              scale="sm"
                              className="w-auto relative z-10"
                            >
                              End rally
                            </Button>
                          )}
                          <div className="mis-auto">
                            <>
                              {/** @ts-ignore */}
                              {(![DICTIONARY_STATES_AUDIO_CHATS.LIVE.label].includes(audioChat.data.state) ||
                                ([
                                  DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                                  DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                                  //@ts-ignore
                                ].includes(audioChat.data.state) &&
                                  isFuture(audioChat.data.datetime_start_at))) && (
                                <Menu as="div" className="text-2xs relative z-10">
                                  <Menu.Button
                                    className={button({
                                      intent: 'neutral-ghost',
                                      scale: 'xs',
                                      class: 'ui-open:bg-opacity-10 rounded-md',
                                    })}
                                  >
                                    More
                                  </Menu.Button>
                                  <Menu.Items className="absolute flex flex-col w-full  xs:w-max-content inline-end-0 mt-2 origin-top-right divide-y border-neutral-6 border divide-neutral-4 rounded-md overflow-hidden bg-neutral-3 focus:outline-none">
                                    {[
                                      DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                                      DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                                      //@ts-ignore
                                    ].includes(audioChat.data.state) &&
                                      isFuture(audioChat.data.datetime_start_at) && (
                                        <>
                                          <Menu.Item
                                            as="button"
                                            className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                                            onClick={() =>
                                              push(ROUTE_RALLY_EDIT.replace('[idRally]', audioChat.data.id))
                                            }
                                          >
                                            <PencilIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                                            Edit
                                          </Menu.Item>
                                          <Menu.Item
                                            className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                                            as="button"
                                            onClick={() => stateTxUiCancelRally.selectRallyToCancel(audioChat.data.id)}
                                          >
                                            <ExclamationCircleIcon className="ui-active:text-interactive-9 w-4 mie-1ex" />
                                            Cancel
                                          </Menu.Item>
                                        </>
                                      )}
                                    {/* @ts-ignore */}
                                    {![DICTIONARY_STATES_AUDIO_CHATS.LIVE.label].includes(audioChat.data.state) && (
                                      <Menu.Item
                                        className="flex items-center space-i-2 px-4 text-start py-2.5 ui-active:text-neutral-1 ui-active:bg-neutral-12 font-bold"
                                        as="button"
                                        onClick={() => stateTxUiDeleteRally.selectRallyToDelete(audioChat.data.id)}
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
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </main>
      <DialogCancelRallyConfirmation
        stateTxUi={stateTxUiCancelRally}
        stateCancelAudioChat={stateCancelAudioChat}
        onClickCancel={onClickCancelAudioChat}
      />
      <DialogDeleteRallyConfirmation
        stateTxUi={stateTxUiDeleteRally}
        stateDeleteAudioChat={stateDeleteAudioChat}
        onClickDelete={onClickDeleteAudioChat}
      />
      <DialogGoLive stateTxUi={stateTxUiRallyGoLive} stateGoLiveAudioChat={stateGoLive} />
      <DialogEndLive stateTxUi={stateTxUiEndLiveRally} stateEndLiveAudioChat={stateEndLiveAudioChat} />
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
