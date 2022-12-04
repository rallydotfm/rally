import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutAccount'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import { PermissionsDispatcher } from '@components/pages/account/permissions/PermissionsDispatcher'
const Page: NextPage = () => {
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  return (
    <>
      <Head>
        <title>Permissions / Account - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md">Setup your permissions</h1>
        {queryLensProfile?.data?.handle && <PermissionsDispatcher profile={queryLensProfile?.data} />}
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
