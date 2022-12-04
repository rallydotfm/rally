import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutPreferences'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import ListInterests from '@components/pages/preferences/interests/ListInterests'
import { IconSpinner } from '@components/Icons'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import Notice from '@components/Notice'

const Page: NextPage = () => {
  const account = useAccount()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryListInterests = useGetProfilesInterests()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  return (
    <>
      <Head>
        <title>Profile Interests / Preferences - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md">Setup your profile interests</h1>
        <p className="pt-3 text-xs text-neutral-11">
          Select the topics you're interested by. Rally will use those to display curated rooms and recordings for you.
        </p>
        <p className="font-bold mt-1 mb-6 text-xs">You can select up to 12 interests.</p>
        {queryListInterests?.isLoading ||
          (queryLensProfile.isLoading && (
            <div className="mb-6 flex items-center justify-center space-i-1ex">
              <IconSpinner className="text-lg animate-spin" />
              <p className="font-bold animate-pulse">Loading ...</p>
            </div>
          ))}

        {queryListInterests?.data?.length && (
          <>
            {queryLensProfile?.isSuccess && (
              <>
                {queryLensProfile?.data === null && (
                  <Notice intent="primary-outline" className="mb-8 animate-appear">
                    It seems you don't have a Lens profile associated to your address. <br />
                    Therefore, your profile interests will only be saved locally.
                  </Notice>
                )}
                <ListInterests
                  profile={queryLensProfile?.data}
                  source={
                    queryLensProfile?.data?.interests
                      ? queryLensProfile?.data?.interests
                      : interests?.[account?.address as `0x${string}`]?.length
                      ? interests?.[account?.address as `0x${string}`]
                      : []
                  }
                  list={queryListInterests?.data}
                />
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
