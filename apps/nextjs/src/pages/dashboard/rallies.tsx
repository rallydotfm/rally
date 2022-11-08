import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import useGetAudioChatsByWalletAddress from '@hooks/useGetAudioChatsByWalletAddress'
import { getLayout } from '@layouts/LayoutDashboard'
import Button from '@components/Button'
import Link from 'next/link'
import button from '@components/Button/styles'
import { ROUTE_RALLY_UPDATE, ROUTE_RALLY_VIEW } from '@config/routes'
import { IconSpinner } from '@components/Icons'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { format, isFuture, formatRelative } from 'date-fns'
import { useEffect, useState } from 'react'
import { useCancelAudioChat, useStoreTxUiCancelRally } from '@hooks/useCancelAudioChat'
import DialogModal from '@components/DialogModal'

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
  const stateTxUiCancelRally = useStoreTxUiCancelRally()
  const { onClickCancelAudioChat, stateCancelAudioChat } = useCancelAudioChat(
    stateTxUiCancelRally,
    queryAudioChatsByAddressRawData.refetch,
  )
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.START_CLOSEST)
  return (
    <>
      <Head>
        <title>Dashboard - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main>
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
            <div className="mb-3 animate-appear  flex justify-between">
              <h2 className="font-medium text-xs text-neutral-11">
                {queriesAudioChatsByAddressMetadata.filter((query) => query?.status === 'success')?.length} rallies
              </h2>
              <Button
                intent="neutral-ghost"
                scale="xs"
                onClick={async () => await queryAudioChatsByAddressRawData.refetch()}
              >
                Refresh
              </Button>
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
                  return (
                    <li
                      className="animate-appear relative overflow-hidden focus-within:bg-neutral-3 xs:pt-2 pb-3 md:pb-4 xs:pis-2 xs:pie-4 rounded-md bg-neutral-1"
                      key={audioChat.data.id}
                    >
                      {audioChat.data.state}
                      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', audioChat.data.id)}>
                        <a className="absolute inset-0 w-full h-full opacity-0">View page</a>
                      </Link>
                      <div className="xs:pt-2 xs:pis-2 xs:pie-4">
                        <article className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
                          <div className="relative w-full overflow-hidden xs:w-20 sm:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
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

                          <div className="px-4 flex-grow flex flex-col xs:px-0">
                            {' '}
                            <h1 className="font-bold">{audioChat.data.name}</h1>
                            {audioChat.data.state !== DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label ? (
                              <>
                                <p className="mt-2 font-medium flex items-start text-neutral-12 text-xs">
                                  <CalendarIcon className="translate-y-1 opacity-90 shrink-0 w-5 mie-2" />
                                  {formatRelative(audioChat.data.datetime_start_at, new Date())}
                                  <br />
                                  <span>&nbsp;({format(audioChat.data.datetime_start_at, 'ppp')})</span>
                                </p>
                              </>
                            ) : (
                              'Cancelled'
                            )}
                            <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                              {audioChat.data.is_private ? 'Gated access' : 'Free access'}
                            </p>
                            <p className="text-neutral-11 text-2xs mt-2">
                              {audioChat.data.cohosts_list.length} cohosts
                            </p>
                          </div>
                        </article>
                        <div className="flex flex-col space-y-3 xs:space-y-0 xs:flex-row border-t border-t-neutral-5 pt-3 px-4 xs:pt-1.5 md:pt-4 mt-6 xs:-mis-4 xs:-mie-8 xs:px-6">
                          {[
                            DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                            DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                          ].includes(audioChat.data.state) &&
                            isFuture(audioChat.data.datetime_start_at) && (
                              <Button className="relative z-10">Go live</Button>
                            )}
                          <div className="xs:mis-auto">
                            {[
                              DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
                              DICTIONARY_STATES_AUDIO_CHATS.READY.label,
                            ].includes(audioChat.data.state) &&
                              isFuture(audioChat.data.datetime_start_at) && (
                                <Link href={ROUTE_RALLY_UPDATE.replace('[idRally]', audioChat.data.id)}>
                                  <a
                                    className={button({
                                      scale: 'sm',
                                      intent: 'primary-ghost',
                                      class: 'relative z-20 xs:mie-4',
                                    })}
                                  >
                                    Edit
                                  </a>
                                </Link>
                              )}

                            {[DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label].includes(audioChat.data.state) &&
                              isFuture(audioChat.data.datetime_start_at) && (
                                <Button
                                  onClick={() => {
                                    stateTxUiCancelRally.selectRallyToCancel(audioChat.data.id)
                                  }}
                                  scale="sm"
                                  intent="negative-ghost"
                                  className="relative xs:mie-4 z-20"
                                >
                                  Cancel
                                </Button>
                              )}
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
      <DialogModal
        title="Cancel rally"
        isOpen={stateTxUiCancelRally.isDialogVisible}
        setIsOpen={stateTxUiCancelRally.setDialogVisibility}
      >
        <p className="font-bold text-center py-6">Are you sure you want to cancel this rally ?</p>
        <div className="flex flex-col justify-center items-center xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
          <Button
            isLoading={stateCancelAudioChat.contract.isLoading || stateCancelAudioChat.transaction.isLoading}
            disabled={
              stateCancelAudioChat.contract.isLoading ||
              stateCancelAudioChat.transaction.isLoading ||
              stateCancelAudioChat.contract.isSuccess ||
              stateCancelAudioChat.transaction.isSuccess
            }
            onClick={onClickCancelAudioChat}
          >
            Yes, cancel this rally
          </Button>
          <Button onClick={stateTxUiCancelRally.resetState} intent="neutral-outline">
            Go back
          </Button>
        </div>
      </DialogModal>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
