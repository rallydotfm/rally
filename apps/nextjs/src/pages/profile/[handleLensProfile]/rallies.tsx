import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useGetLensProfileByHandle from '@hooks/useGetLensProfileByHandle'
import { getLayout } from '@layouts/LayoutProfile'
import { AUDIO_CHATS_SORT_ORDER } from '@helpers/audioChatsSortOptions'
import FormSelect from '@components/FormSelect'
import { useUnmountEffect } from '@react-hookz/web'
import useGetAudioChatsByLensHandle from '@hooks/useGetAudioChatsByLensHandle'
import ListFilteredRallies from '@components/pages/profile/[handleLensProfile]/ListFilteredRallies'

const Page: NextPage = () => {
  const {
    query: { handleLensProfile },
  } = useRouter()

  const { queryAudioChatsByLensHandle, skip, perPage, setOrder, order, setSkip, resetFilters } =
    useGetAudioChatsByLensHandle(handleLensProfile as string)
  const queryLensProfile = useGetLensProfileByHandle(handleLensProfile as string, {
    enabled: handleLensProfile ? true : false,
  })

  useUnmountEffect(() => {
    resetFilters()
  })

  return (
    <>
      <Head>
        <title>
          {' '}
          {queryLensProfile?.data?.handle
            ? `${
                queryLensProfile?.data?.name ?? queryLensProfile?.data?.onChainIdentity?.ens?.name ?? handleLensProfile
              } (@${handleLensProfile}) `
            : handleLensProfile ?? 'Profile '}{' '}
          rallies - Rally
        </title>
        <meta
          name="description"
          content="Discover upcoming audio rooms on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      {/* @ts-ignore */}
      {queryAudioChatsByLensHandle?.data?.length > 0 && (
        <>
          <div className="animate-appear pb-10 pt-6 flex flex-wrap gap-2 justify-between items-center">
            <div className="w-fit-content flex items-center gap-2">
              <label htmlFor="sortProfileRallies" className="text-2xs font-medium text-neutral-11">
                Sort by
              </label>
              <FormSelect
                name="sortProfileRallies"
                className="w-auto"
                value={order.toString()}
                hasError={false}
                scale="sm"
                //@ts-ignore
                onChange={(e) => {
                  const value = e.currentTarget.value.split('.') as [string, string]
                  setOrder(value)
                }}
              >
                {AUDIO_CHATS_SORT_ORDER.map((order: { label: string; value: string }) => (
                  <option value={order.value} key={`search-result-order-${order.value}`}>
                    {order.label}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <ListFilteredRallies
            list={queryAudioChatsByLensHandle?.data as Array<any>}
            skip={skip}
            isLoading={queryAudioChatsByLensHandle?.isLoading}
            isError={queryAudioChatsByLensHandle?.isError}
            perPage={perPage}
            setSkip={setSkip}
          />
        </>
      )}
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
