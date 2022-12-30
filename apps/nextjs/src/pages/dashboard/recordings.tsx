import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import useGetPublishedRecordingsByWalletAddress from '@hooks/useGetPublishedRecordingsByWalletAddress'
import { getLayout } from '@layouts/LayoutDashboard'
import { IconSpinner } from '@components/Icons'
import { useState } from 'react'
import { CardRecording } from '@components/pages/dashboard/CardRecording'

const SORT_ORDER = {
  START_CLOSEST: 'start_at.closest',
  START_FURTHEST: 'start_at.furthest',
  CREATED_OLDEST: 'start_at.oldest',
  CREATED_NEWEST: 'start_at.newest',
}
const Page: NextPage = () => {
  const { address } = useAccount()
  const { queryRecordingsByAddressRawData, queriesAudioChatsByAddressMetadata } =
    useGetPublishedRecordingsByWalletAddress(address)
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.START_CLOSEST)
  return (
    <>
      <Head>
        <title>Published recordings / Dashboard - Rally</title>
        <meta
          name="description"
          content="Manage your audio rooms recordings on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main className="pb-32 h-full">
        {(queryRecordingsByAddressRawData.isLoading ||
          queriesAudioChatsByAddressMetadata.find((query) => query?.isLoading)) && (
          <div className="mb-6 flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading your published recordings...</p>
          </div>
        )}
        {queryRecordingsByAddressRawData.status === 'error' && <>Error</>}
        {queryRecordingsByAddressRawData.status === 'success' && (
          <>
            <div className="mb-6 animate-appear flex justify-between">
              <h2 className="font-medium text-xs text-neutral-11">
<<<<<<< HEAD
                {
                  //@ts-ignore
                  queriesAudioChatsByAddressMetadata.filter((query) => query?.data?.id && query?.data?.recording !== '')
                    ?.length
                }{' '}
                recording
                {
                  //@ts-ignore
                  queriesAudioChatsByAddressMetadata.filter((query) => query?.data?.id && query?.data?.recording !== '')
                    ?.length > 1 && 's'
                }
=======
                {queriesAudioChatsByAddressMetadata.filter((query) => query?.status === 'success')?.length} rallies
>>>>>>> d3d8ced (MVP (#8))
              </h2>
            </div>
            <ul
              className={`${
                queryRecordingsByAddressRawData.isRefetching ? 'animate-pulse' : ''
              } space-y-8 animate-appear`}
            >
              {queriesAudioChatsByAddressMetadata
                //@ts-ignore
<<<<<<< HEAD
                .filter((query) => {
                  //@ts-ignore
                  return query?.data?.id && query?.data?.recording !== ''
                })
=======
                .filter((query) => query?.data?.id)
>>>>>>> d3d8ced (MVP (#8))
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
<<<<<<< HEAD
                    <li
                      className={`animate-appear focus-within:z-10 relative`}
                      //@ts-ignore
                      key={`dashboard-recordings-${audioChat.data.id}`}
                    >
=======
                    <li className={`animate-appear focus-within:z-10 relative`} key={audioChat.data.id}>
>>>>>>> d3d8ced (MVP (#8))
                      <CardRecording
                        data={audioChat.data}
                        onClickGoLive={undefined}
                        onClickEndLive={undefined}
                        onSelectRallyToCancel={undefined}
                        onSelectRallyToDelete={undefined}
                      />
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
