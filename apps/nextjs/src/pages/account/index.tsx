import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutAccount'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import EditProfile from '@components/pages/account/edit-profile/EditProfile'

const Page: NextPage = () => {
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  return (
    <>
      <Head>
        <title>Edit my profile / Account - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main>
        <h1 className="font-bold text-md pb-8 animate-appear">Edit your profile</h1>
        {queryLensProfile?.isLoading && <p className="animate-pulse">Loading profile data...</p>}
        {queryLensProfile?.data?.handle && <EditProfile profile={queryLensProfile?.data} />}
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
