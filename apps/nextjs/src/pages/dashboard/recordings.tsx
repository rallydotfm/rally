import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutDashboard'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <p>This page is under construction.</p>
    </>
  )
}

Page.getLayout = getLayout

export default Page
