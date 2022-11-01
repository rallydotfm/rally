import type { NextPage } from 'next'
import Head from 'next/head'
import FormAudioEvent from '@components/pages/rally/FormAudioChat'
import useSmartContract from '@components/pages/rally/FormAudioChat/useSmartContract'
import useForm from '@components/pages/rally/FormAudioChat/useForm'

const Page: NextPage = () => {
  const { onSubmitNewAudioChat, stateNewAudioChat } = useSmartContract()
  const { formAudioChat, apiInputRallyTags } = useForm({
    onSubmit: onSubmitNewAudioChat,
    initialValues: {
      rally_is_private: false,
      rally_has_cohosts: false,
      rally_is_recorded: false,
      rally_tags: [],
      rally_cohosts: [],
      rally_name: '',
      rally_description: '',
      rally_start_at: '',
      rally_access_control_guilds: [],
      rally_access_control_blacklist: [],
      rally_access_control_whitelist: [],
    },
  })
  return (
    <>
      <Head>
        <title>Create new rally - Rally</title>
        <meta name="description" content="Rally is the place to be." />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-2xl mb-3">Create a new rally</h1>
        <p className="text-xs mb-8 text-neutral-11">
          A rally is an online space where you and selected members of your audience can have live audio conversation.{' '}
          <br />
          Who can join, when, to discuss about what and how is up to you.
        </p>
        <FormAudioEvent storeForm={formAudioChat} apiInputRallyTags={apiInputRallyTags} state={stateNewAudioChat} />
      </main>
    </>
  )
}

export default Page
