import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutAccount'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import ListInterests from '@components/pages/account/interests/ListInterests'

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
        <title>Profile Interests / Account - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main>
        <h1 className="font-bold text-md">Setup your profile interests</h1>
        <p className="pt-3 text-xs text-neutral-11">
          Select the topics you're interested by. Rally will use those to display curated rooms and recordings for you.
        </p>
        <p className="font-bold mt-1 mb-6 text-xs">You can select up to 12 interests.</p>
        {queryLensProfile?.data && queryListInterests?.data?.length && (
          <ListInterests profile={queryLensProfile?.data} list={queryListInterests?.data} />
        )}
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
