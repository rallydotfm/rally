import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutAccount'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import EditMembership from '@components/pages/account/membership/EditMembership'

const Page: NextPage = () => {
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  return (
    <>
      <Head>
        <title>Membership / Account - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md">Setup your profile membership</h1>
        <p className="pt-3 pb-8 text-xs text-neutral-11">
          You can fine-tune who can follow your profile, and even charge a one-time fee to every profile that will
          follow your profile !
        </p>
        {queryLensProfile?.isLoading && <p className="animate-pulse">Loading profile data...</p>}
        {queryLensProfile?.data?.handle && <EditMembership profile={queryLensProfile?.data} />}
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
