import type { NextPage } from 'next'
import Head from 'next/head'
import { IconSpinner } from '@components/Icons'
import Notice from '@components/Notice'
import { useRouter } from 'next/router'
import { useAccount, useMutation } from 'wagmi'
import useGetAudioChatToEdit from '@components/pages/rally/edit/useGetAudioChatToEdit'
import { getLayout as getProtectedLayout } from '@layouts/LayoutWalletRequired'
import { getLayout as getBaseLayout } from '@layouts/LayoutBase'
import PublishSpark from '@components/pages/rally/publish/spark/PublishSpark'
import { useStoreBundlr } from '@hooks/useBundlr'
import Button from '@components/Button'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'

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
  const initialize = useStoreBundlr((state: any) => state.initialize)
  const mutationPrepareBundlr = useMutation(async () => await initialize())
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const queryCurrentUserDefaultLensProfile = useWalletAddressDefaultLensProfile(address as `0x${string}`, {
    enabled: address ? true : false,
  })
  return (
    <>
      <Head>
        <title>Publish a Spark - Rally</title>
        <meta
          name="description"
          content="Publish a highlight moment of your audio room on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main>
        <h1 className="font-bold text-2xl mb-3">Publish Spark</h1>
        <p className="text-xs mb-1 text-neutral-11">
          A spark is a short video (less than 3 minutes) highlighting a moment in your rally.
        </p>

        {!isReady ||
          queryCurrentUserDefaultLensProfile?.isLoading === true ||
          (queryAudioChatByIdRawData?.status === 'loading' && (
            <div className="animate-appear flex items-center space-i-1ex">
              <IconSpinner className="animate-spin " />
              <p className="font-medium animate-pulse">Loading...</p>
            </div>
          ))}
        {queryAudioChatByIdRawData?.status === 'success' && (
          <>
            {/* @ts-ignore */}
            {queryAudioChatByIdRawData?.data?.creator !== address ? (
              <>
                <Notice>You can't access this page.</Notice>
              </>
            ) : (
              <>
                {queryAudioChatMetadata.isSuccess && (
                  <>
                    {!bundlr ? (
                      <div className="animate-appear pt-8 gap-3 flex flex-col justify-center items-center">
                        <Button
                          disabled={mutationPrepareBundlr?.isLoading}
                          isLoading={mutationPrepareBundlr?.isLoading}
                          onClick={async () => await mutationPrepareBundlr.mutateAsync()}
                        >
                          {mutationPrepareBundlr?.isLoading
                            ? 'Connecting, sign the message in your wallet...'
                            : mutationPrepareBundlr?.isError
                            ? 'Try connecting again'
                            : 'Connect to Bundlr first'}
                        </Button>
                        <div className="flex flex-wrap gap-3">
                          <a
                            className="text-neutral-11 text-2xs"
                            target="_blank "
                            href="https://docs.bundlr.network/docs/overview?utm_source=website&utm_campaign=footer_cta/"
                          >
                            Curious about Bundlr ?{' '}
                            <span className="underline hover:no-underline">Learn more on Bundlr's documentation.</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 animate-appear">
                        <PublishSpark
                          showSectionLens={queryCurrentUserDefaultLensProfile?.data}
                          values={queryAudioChatMetadata.data}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = (page: any) => {
  return getBaseLayout(getProtectedLayout(page))
}

export default Page
