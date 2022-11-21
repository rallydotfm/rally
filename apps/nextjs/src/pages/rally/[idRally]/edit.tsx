import type { NextPage } from 'next'
import Head from 'next/head'
import { IconSpinner } from '@components/Icons'
import Notice from '@components/Notice'
import FormEditAudioChat from '@components/pages/rally/edit/FormEditAudioChat'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import useGetAudioChatToEdit from '@components/pages/rally/edit/useGetAudioChatToEdit'

const Page: NextPage = () => {
  const { address } = useAccount()
  const {
    query: { idRally },
    isReady,
  } = useRouter()
  //@ts-ignore
  const { queryAudioChatByIdRawData, queryAudioChatMetadata } =
    //@ts-ignore
    useGetAudioChatToEdit(idRally)

  return (
    <>
      <Head>
        <title>Edit rally - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main>
        <h1 className="font-bold text-2xl mb-3">Edit rally</h1>
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
                {queryAudioChatMetadata.isSuccess && (
                  <FormEditAudioChat
                    //@ts-ignore
                    values={{
                      ...queryAudioChatMetadata.data,
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

export default Page
