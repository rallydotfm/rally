import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useGetLensProfileByHandle from '@hooks/useGetLensProfileByHandle'
import AboutProfile from '@components/pages/profile/[handleLensProfile]/AboutProfile'
import { useAccount } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { getLayout } from '@layouts/LayoutProfile'
const Page: NextPage = () => {
  const {
    query: { handleLensProfile },
  } = useRouter()
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state: any) => state.isSignedIn)

  const queryLensProfile = useGetLensProfileByHandle(handleLensProfile as string, {
    enabled: handleLensProfile || isSignedIn || account?.address ? true : false,
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
            : handleLensProfile ?? 'Profile '}
          - Rally
        </title>
        <meta
          name="description"
          content="Discover upcoming audio rooms on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>

      {queryLensProfile?.data && (
        <>
          {/* @ts-ignore */}
          <AboutProfile data={queryLensProfile?.data} />
        </>
      )}
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
