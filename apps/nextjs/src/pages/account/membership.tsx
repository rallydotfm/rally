import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutAccount'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'

const Page: NextPage = () => {
  const account = useAccount()
  const queryListInterests = useGetProfilesInterests()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  return (
    <>
      <Head>
        <title>Membership / Account - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main>
        <h1 className="font-bold text-md">Setup your profile membership</h1>
        <p className="pt-3 text-xs text-neutral-11">
          Select the topics you're interested by. Rally will use those to display curated rooms and recordings for you.
        </p>
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
