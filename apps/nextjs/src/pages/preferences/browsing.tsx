import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutPreferences'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import ListInterests from '@components/pages/preferences/browsing/ListInterests'
import { IconSpinner } from '@components/Icons'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import Notice from '@components/Notice'
import { useSession } from 'next-auth/react'

const Page: NextPage = () => {
  const session = useSession()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryListInterests = useGetProfilesInterests()
  //@ts-ignore
  const queryLensProfile = useWalletAddressDefaultLensProfile(session?.data?.address as `0x${string}`, {
    //@ts-ignore
    enabled: session?.data?.address ? true : false,
  })
  return (
    <>
      <Head>
        <title>Browsing settings / Preferences - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md">Browsing settings</h1>
        <section className="pt-6">
          <h2 className="font-bold text-[1.2em] mb-2">Profile interests</h2>
          <p className="text-xs text-neutral-11">
            Rally uses your picked profile interests to personalize the rooms, recordings and posts that you see. If you
            own a Lens profile, your profile interests will be displayed on your public profile page.
          </p>
          <p className="font-bold mt-3 mb-8 text-xs">You can select up to 12 interests.</p>
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
                        : //@ts-ignore
                        interests?.[account?.address as `0x${string}`]?.length
                        ? //@ts-ignore
                          interests?.[account?.address as `0x${string}`]
                        : []
                    }
                    list={queryListInterests?.data}
                  />
                </>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
