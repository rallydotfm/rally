import type { NextPage } from 'next'
import Head from 'next/head'
import useGetAudioChatById from '@hooks/useGetAudioChatById'
import { IconSpinner } from '@components/Icons'
import Notice from '@components/Notice'
import FormUpdateAudioChat from '@components/pages/rally/FormUpdateAudioChat'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const Page: NextPage = () => {
  const { address } = useAccount()
  const {
    query: { idRally },
    isReady,
  } = useRouter()
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(idRally)

  return (
    <>
      <Head>
        <title>Update rally - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main>
        <h1 className="font-bold text-2xl mb-3">Update rally</h1>
        {!isReady ||
          (queryAudioChatByIdRawData?.status === 'loading' && (
            <div className="animate-appear flex items-center space-i-1ex">
              <IconSpinner className="animate-spin " />
              <p className="font-medium animate-pulse">Loading rally...</p>
            </div>
          ))}
        {queryAudioChatByIdRawData?.status === 'success' && (
          <>
            {queryAudioChatByIdRawData?.data?.creator !== address ? (
              <>
                <Notice>You can't access this page.</Notice>
              </>
            ) : (
              <>
                <FormUpdateAudioChat
                  values={{
                    ...queryAudioChatMetadata,
                  }}
                />
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

export default Page
