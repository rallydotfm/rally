import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutDashboard'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Rally</title>
        <meta
          name="description"
          content="Manage your recordings on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <p>This page is under construction.</p>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout

export default Page
