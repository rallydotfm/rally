import type { NextPage } from 'next'
import Head from 'next/head'
import { IconSpinner } from '@components/Icons'
import Notice from '@components/Notice'
import FormEditAudioChat from '@components/pages/rally/edit/FormEditAudioChat'
import { useRouter } from 'next/router'
import { useAccount, useMutation } from 'wagmi'
import useGetAudioChatToEdit from '@components/pages/rally/edit/useGetAudioChatToEdit'
import { getLayout as getProtectedLayout } from '@layouts/LayoutWalletRequired'
import { getLayout as getBaseLayout } from '@layouts/LayoutBase'
import PublishRecording from '@components/pages/rally/publish-recording/PublishRecording'
import { useStoreBundlr } from '@hooks/useBundlr'
import { useMountEffect } from '@react-hookz/web'
import Button from '@components/Button'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'

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
        <title>Publish recording - Rally</title>
        <meta
          name="description"
          content="Publish the recording audio room on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main>
        <h1 className="font-bold text-2xl mb-3">Publish recording</h1>
        <p className="text-xs mb-1 text-neutral-11">
          Rally keeps only keeps your recording for 3 days. Upload your recording on Arweave via Bundlr to keep it
          online forever, and publish it to make it accessible to your audience.
        </p>
        <p className="mb-8 text-xs text-neutral-11">Bundlr makes decentralized storage fast, easy, and reliable.</p>

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
            {queryAudioChatByIdRawData?.data?.creator !== address ? (
              <>
                <Notice>You can't access this page.</Notice>
              </>
            ) : (
              <>
                {queryAudioChatMetadata.isSuccess && (
                  <>
                    {!queryAudioChatMetadata.data.will_be_recorded ? (
                      <>
                        <p>You didn't configure this rally to be recorded.</p>
                      </>
                    ) : (
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
                                <span className="underline hover:no-underline">
                                  Learn more on Bundlr's documentation.
                                </span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 animate-appear">
                            <PublishRecording
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
