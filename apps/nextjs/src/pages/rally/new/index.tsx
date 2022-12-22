import type { NextPage } from 'next'
import Head from 'next/head'
import FormAudioEvent from '@components/pages/rally/FormAudioChat'
import { useSmartContract, useStoreTxUi } from '@components/pages/rally/FormAudioChat/useSmartContract'
import useForm from '@components/pages/rally/FormAudioChat/useForm'
import DialogModal from '@components/DialogModal'
import { ROUTE_DASHBOARD, ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import Button from '@components/Button'
import Notice from '@components/Notice'
import button from '@components/Button/styles'
import { useUnmountEffect } from '@react-hookz/web'
import { DeploymentStep } from '@components/DeploymentStep'
import { getLayout as getProtectedLayout } from '@layouts/LayoutWalletRequired'
import { getLayout as getBaseLayout } from '@layouts/LayoutBase'
import supabase from '../../../config/supabaseClient'
const Page: NextPage = () => {
  const stateTxUi = useStoreTxUi()
  const { onSubmitNewAudioChat, stateNewAudioChat } = useSmartContract(stateTxUi)
  const { formAudioChat, apiInputRallyTags } = useForm({
    onSubmit: (values: any) => {
      onSubmitNewAudioChat(values)
    },
    initialValues: {
      rally_category: '',
      rally_language: '',
      rally_is_gated: false,
      rally_has_cohosts: false,
      rally_is_recorded: false,
      rally_clips_allowed: false,
      rally_is_indexed: false,
      rally_tags: [],
      rally_cohosts: [],
      rally_guests: [],
      rally_name: '',
      rally_description: '',
      rally_start_at: '',
      rally_access_control_guilds: [],
      rally_is_nsfw: false,
    },
  })
  useUnmountEffect(() => {
    stateTxUi.resetState()
  })
  return (
    <>
      <Head>
        <title>Create new rally - Rally</title>
        <meta
          name="description"
          content="Create your audio room on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main className="animate-appear">
        <h1 className="font-bold text-2xl mb-3">Create a new rally</h1>
        <p className="text-xs mb-8 text-neutral-11">
          A rally is an online space where you and selected members of your audience can have live audio conversation.{' '}
          <br />
          Who can join, when, to discuss about what and how is up to you.
        </p>
        <FormAudioEvent
          storeForm={formAudioChat}
          apiInputRallyTags={apiInputRallyTags}
          state={stateNewAudioChat}
          labelButtonSubmit="Create new rally"
          labelButtonSubmitting="Creating..."
        />
      </main>
      <DialogModal
        title="Deploying new rally"
        isOpen={stateTxUi.isDialogVisible}
        setIsOpen={stateTxUi.setDialogVisibility}
      >
        <span className="font-bold">Deploying new rally</span>
        {/* @ts-ignore */}
        <ol className="space-y-3 mt-6 font-medium text-xs">
          {formAudioChat?.data()?.rally_image_file && (
            <li className={`flex items-center text-white`}>
              <DeploymentStep
                isLoading={stateNewAudioChat.uploadImage.isLoading}
                isError={stateNewAudioChat.uploadImage.isError}
                isSuccess={stateNewAudioChat.uploadImage.isSuccess}
              >
                Uploading image to IPFS
              </DeploymentStep>
            </li>
          )}
          <li
            className={`
            flex items-center
            ${stateNewAudioChat.uploadData.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateNewAudioChat.uploadData.isLoading}
              isError={stateNewAudioChat.uploadData.isError}
              isSuccess={stateNewAudioChat.uploadData.isSuccess}
            >
              Uploading Rally metadata
            </DeploymentStep>
          </li>
          <li
            className={`
            flex items-center 
            ${stateNewAudioChat.contract.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateNewAudioChat.contract.isLoading}
              isError={stateNewAudioChat.contract.isError}
              isSuccess={stateNewAudioChat.contract.isSuccess}
            >
              Sign the 'Create rally' transaction{' '}
            </DeploymentStep>
          </li>
          <li
            className={`
            flex items-center 
            ${stateNewAudioChat.transaction.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateNewAudioChat.transaction.isLoading}
              isError={stateNewAudioChat.transaction.isError}
              isSuccess={stateNewAudioChat.transaction.isSuccess}
            >
              Creating rally
            </DeploymentStep>
          </li>
        </ol>
        {[
          stateNewAudioChat.transaction,
          stateNewAudioChat.contract,
          stateNewAudioChat.uploadImage,
          stateNewAudioChat.uploadData,
        ].filter((slice) => slice.isError)?.length > 0 && (
          <div className="mt-6 animate-appear">
            {[
              stateNewAudioChat.transaction,
              stateNewAudioChat.contract,
              stateNewAudioChat.uploadImage,
              stateNewAudioChat.uploadData,
            ]
              .filter((slice) => slice.isError)
              .map((slice, key) => (
                <Notice className="overflow-hidden text-ellipsis" intent="negative-outline" key={`error-${key}`}>
                  {/* @ts-ignore */}
                  {slice.error?.message ?? slice?.error}
                </Notice>
              ))}
            <Button className="mt-6" onClick={() => formAudioChat.handleSubmit()}>
              Try again
            </Button>
          </div>
        )}
        {stateNewAudioChat.transaction?.isSuccess && stateTxUi.rallyId && (
          <div className="animate-appear space-y-4 mt-6">
            <Notice>
              🎉 Your Rally was created successfully ! <br />
              <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', stateTxUi.rallyId)}>
                <a>
                  Check it <span className="underline hover:no-underline">here</span>
                </a>
              </Link>
            </Notice>
            <div className="flex flex-col space-y-3 xs:space-y-0 xs:space-i-3 xs:flex-row ">
              <Link href={ROUTE_DASHBOARD}>
                <a className={button({ intent: 'primary-outline' })}>Go to my dashboard</a>
              </Link>
              <Button onClick={() => stateTxUi.setDialogVisibility(false)}>Go back</Button>
            </div>
          </div>
        )}
      </DialogModal>
    </>
  )
}

//@ts-ignore
Page.getLayout = (page: any) => {
  return getBaseLayout(getProtectedLayout(page))
}

export default Page
