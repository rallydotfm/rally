import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutPreferences'
import JoinRoomAs from '@components/pages/preferences/room/JoinRoomAs'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Room / Preferences - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-md mb-3">Setup your room preferences</h1>
        <JoinRoomAs />
      </main>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout
export default Page
