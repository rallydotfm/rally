import type { NextPage } from 'next'
import Head from 'next/head'
import FormAudioEvent from '@components/pages/rally/FormAudioChat'
import { useSmartContract, useStoreTxUi } from '@components/pages/rally/FormAudioChat/useSmartContract'
import useForm from '@components/pages/rally/FormAudioChat/useForm'
import DialogModal from '@components/DialogModal'
import { IconSpinner } from '@components/Icons'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { ROUTE_DASHBOARD, ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import Button from '@components/Button'
import Notice from '@components/Notice'
import button from '@components/Button/styles'
import { useUnmountEffect } from '@react-hookz/web'
import { DeploymentStep } from '@components/DeploymentStep'

const Page: NextPage = () => {
  const stateTxUi = useStoreTxUi()
  const { onSubmitNewAudioChat, stateNewAudioChat } = useSmartContract(stateTxUi)
  const { formAudioChat, apiInputRallyTags } = useForm({
    onSubmit: (values: any) => onSubmitNewAudioChat(values),
    initialValues: {
      rally_is_gated: false,
      rally_has_cohosts: false,
      rally_is_recorded: false,
      rally_is_indexed: false,
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
  useUnmountEffect(() => {
    stateTxUi.resetState()
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
          {formAudioChat.data()?.rally_has_cohosts === true && (
            <li
              className={`
              flex items-center
             ${stateNewAudioChat.uploadData.isIdle ? 'text-neutral-11' : 'text-white'}`}
            >
              <DeploymentStep
                isLoading={stateNewAudioChat.signEncryption.isLoading}
                isError={stateNewAudioChat.signEncryption.isError}
                isSuccess={stateNewAudioChat.signEncryption.isSuccess}
              >
                Confirming co-hosts Etheurem address encryption
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
              Sign create rally transaction{' '}
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
          stateNewAudioChat.signEncryption,
          stateNewAudioChat.transaction,
          stateNewAudioChat.contract,
          stateNewAudioChat.uploadImage,
          stateNewAudioChat.uploadData,
        ].filter((slice) => slice.isError)?.length > 0 && (
          <div className="mt-6 animate-appear">
            {[
              stateNewAudioChat.signEncryption,
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

export default Page
