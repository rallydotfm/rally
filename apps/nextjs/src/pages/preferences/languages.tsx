import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutPreferences'
import ListLanguages from '@components/pages/preferences/languages/ListLanguages'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Languages / Preferences - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md">Setup your preferred languages</h1>
        <p className="pt-3 text-xs text-neutral-11">
          Select the languages you practice so Rally can display rooms and recordings matching those in priority.
        </p>
        <div className="flex items-center gap-1 mt-2 mb-6">
          <InformationCircleIcon className="w-5  text-neutral-12" />
          <p className="font-semibold text-xs">Your selection will only be saved locally.</p>
        </div>
        <ListLanguages />
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
