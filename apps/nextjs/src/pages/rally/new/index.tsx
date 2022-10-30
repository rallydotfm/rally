import type { NextPage } from 'next'
import Head from 'next/head'
import FormCreateNewAudioEvent from '@components/pages/FormCreateNewAudioEvent'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create new audio event - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main>
        <h1 className="font-bold text-2xl mb-3">Create a new rally</h1>
        <p className="text-xs mb-8 text-neutral-11">
          A rally is an online space where you and selected members of your audience can have live audio conversation.{' '}
          <br />
          Who can join, when, to discuss about what and how is up to you.
        </p>
        <FormCreateNewAudioEvent />
      </main>
    </>
  )
}

export default Page
