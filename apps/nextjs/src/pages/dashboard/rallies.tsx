import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import useGetAudioChatsByWalletAddress from '@hooks/useGetAudioChatsByWalletAddress'
import { getLayout } from '@layouts/LayoutDashboard'
import { IconSpinner } from '@components/Icons'
import { useState } from 'react'
import { useCancelAudioChat, useStoreTxUiCancelRally } from '@hooks/useCancelAudioChat'
import { useDeleteAudioChat, useStoreTxUiDeleteRally } from '@hooks/useDeleteAudioChat'
import { useGoLiveAudioChat, useStoreTxUiGoLiveRally } from '@hooks/useGoLiveAudioChat'
import { useEndLiveAudioChat, useStoreTxUiEndLiveRally } from '@hooks/useEndLiveAudioChat'
import DialogCancelRallyConfirmation from '@components/DialogCancelRallyConfirmation'
import DialogDeleteRallyConfirmation from '@components/DialogDeleteRallyConfirmation'
import DialogGoLive from '@components/DialogGoLive'
import DialogEndLive from '@components/DialogEndLive'
import { CardRally } from '@components/pages/dashboard/CardRally'
import useDashboardGetUserAvailableRecordingsToDownload from '@hooks/useDashboardGetUserAvailableRecordingsToDownload'
import Notice from '@components/Notice'

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
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.START_CLOSEST)
  const queryAvailableRecordings = useDashboardGetUserAvailableRecordingsToDownload()

  return (
    <>
      <Head>
        <title>Rallies / Dashboard - Rally</title>
        <meta
          name="description"
          content="Manage your audio rooms on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main className="pb-32 h-full">
        {(queryAudioChatsByAddressRawData.isLoading ||
          queriesAudioChatsByAddressMetadata.find((query) => query?.isLoading === true)) && (
          <div className="mb-6 flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading your rallies...</p>
          </div>
        )}
        {queryAudioChatsByAddressRawData.status === 'error' && <>Error</>}
        {queryAudioChatsByAddressRawData.status === 'success' && (
          <>
            {queryAvailableRecordings?.data && Object?.keys(queryAvailableRecordings?.data)?.length > 0 && (
              <Notice className="mb-8" intent="primary-outline">
                Make sure to download your raw recording filles ! They will be deleted after 3 days.
              </Notice>
            )}
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
                //@ts-ignore
                .filter((query) => query?.data?.id)
                /* @ts-ignore */
                .sort((a, b) => {
                  if (sortOrder === SORT_ORDER.START_CLOSEST)
                    //@ts-ignore
                    return a.data.epoch_time_start_at > b.data.epoch_time_start_at
                  //@ts-ignore
                  if (sortOrder === SORT_ORDER.START_FURTHEST)
                    //@ts-ignore
                    return a.data.epoch_time_start_at < b.data.epoch_time_start_at
                  if (sortOrder === SORT_ORDER.CREATED_NEWEST)
                    //@ts-ignore
                    return a.data.epoch_time_created_at > b.data.epoch_time_created_at
                  if (sortOrder === SORT_ORDER.CREATED_OLDEST)
                    //@ts-ignore
                    return a.data.epoch_time_created_at < b.data.epoch_time_created_at
                })
                .map((audioChat) => {
                  return (
                    //@ts-ignore
                    <li
                      className={`animate-appear focus-within:z-10 relative`}
                      //@ts-ignore
                      key={`dashboard-rallies-${audioChat.data.id}`}
                    >
                      <CardRally
                        data={audioChat.data}
                        onClickGoLive={async () => {
                          stateTxUiRallyGoLive.setDialogVisibility(true)
                          //@ts-ignore
                          await onClickGoLive(audioChat.data.id)
                        }}
                        onClickEndLive={async () => {
                          stateTxUiEndLiveRally.setDialogVisibility(true)
                          //@ts-ignore
                          await onClickEndLive(audioChat.data.id)
                        }}
                        //@ts-ignore
                        onSelectRallyToCancel={() => stateTxUiCancelRally.selectRallyToCancel(audioChat.data.id)}
                        //@ts-ignore
                        onSelectRallyToDelete={() => stateTxUiDeleteRally.selectRallyToDelete(audioChat.data.id)}
                      />
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
