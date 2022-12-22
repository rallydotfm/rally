import FormAudioChat from '../../FormAudioChat'
import { useSmartContract, useStoreTxUi } from '@components/pages/rally/FormAudioChat/useSmartContract'
import useForm from '@components/pages/rally/FormAudioChat/useForm'
import { useMountEffect, useUnmountEffect } from '@react-hookz/web'
import DialogModal from '@components/DialogModal'
import { ROUTE_DASHBOARD, ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import Button from '@components/Button'
import Notice from '@components/Notice'
import button from '@components/Button/styles'
import DeploymentStep from '@components/DeploymentStep'

export const FormEditAudioChat = (props: any) => {
  const { values } = props
  const stateTxUi = useStoreTxUi()
  const { onSubmitEditAudioChat, stateEditAudioChat } = useSmartContract(stateTxUi)
  const { formAudioChat, apiInputRallyTags } = useForm({
    onSubmit: (formValues: any) =>
      onSubmitEditAudioChat({
        id: values.id,
        // other values that might be necessary can go here
        created_at: values.epoch_time_created_at,
        current_state: values.state,
        values: formValues,
      }),
    initialValues: {
      rally_clips_allowed: values?.clips_allowed ?? false,
      rally_is_gated: values.is_gated,
      rally_max_attendees: values.max_attendees,
      rally_is_indexed: values.is_indexed,
      rally_has_cohosts: values.has_cohosts,
      rally_is_recorded: values.will_be_recorded,
      rally_tags: values.tags,
      rally_cohosts: values.has_cohosts ? values.cohosts_list : [],
      rally_guests: values.guests_list ?? [],
      rally_name: values.name,
      rally_category: values?.category ?? '',
      rally_language: values?.language ?? 'en',
      rally_is_nsfw: values?.is_nsfw ?? false,
      rally_description: values.description,
      rally_start_at: values.datetime_start_at.toISOString().substring(0, 16),
      rally_image_src: values?.image,
      rally_access_control_guilds:
        values.access_control?.guilds.map((guild: any) => ({
          guild_id: guild.guild_id,
          roles: guild.roles.map((role: any) => role),
        })) ?? [],
      rally_access_control_whitelist: values.access_control.whitelist,
    },
  })
  useMountEffect(() => {
    stateTxUi.setRallyId(values.id)
    stateTxUi.setFileRallyCID(values.cid)
    stateTxUi.setImageRallyCID(values.image)
  })
  useUnmountEffect(() => {
    stateTxUi.resetState()
  })
  return (
    <>
      <FormAudioChat
        storeForm={formAudioChat}
        apiInputRallyTags={apiInputRallyTags}
        state={stateEditAudioChat}
        labelButtonSubmit="Update rally"
        labelButtonSubmitting="Updating..."
      />
      <DialogModal
        title="Deploying rally changes"
        isOpen={stateTxUi.isDialogVisible}
        setIsOpen={stateTxUi.setDialogVisibility}
      >
        <span className="font-bold">Deploying rally changes</span>
        {/* @ts-ignore */}
        <ol className="space-y-3 mt-6 font-medium text-xs">
          {formAudioChat?.data()?.rally_image_file && (
            <li className={`flex items-center text-white`}>
              <DeploymentStep
                isLoading={stateEditAudioChat.uploadImage.isLoading}
                isError={stateEditAudioChat.uploadImage.isError}
                isSuccess={stateEditAudioChat.uploadImage.isSuccess}
              >
                Uploading image to IPFS
              </DeploymentStep>
            </li>
          )}
          <li
            className={`
            flex items-center
            ${stateEditAudioChat.uploadData.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateEditAudioChat.uploadData.isLoading}
              isError={stateEditAudioChat.uploadData.isError}
              isSuccess={stateEditAudioChat.uploadData.isSuccess}
            >
              Uploading Rally metadata
            </DeploymentStep>
          </li>
          <li
            className={`
            flex items-center 
            ${stateEditAudioChat.contract.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateEditAudioChat.contract.isLoading}
              isError={stateEditAudioChat.contract.isError}
              isSuccess={stateEditAudioChat.contract.isSuccess}
            >
              Sign the 'Update rally' transaction{' '}
            </DeploymentStep>
          </li>
          <li
            className={`
            flex items-center 
            ${stateEditAudioChat.transaction.isIdle ? 'text-neutral-11' : 'text-white'}`}
          >
            <DeploymentStep
              isLoading={stateEditAudioChat.transaction.isLoading}
              isError={stateEditAudioChat.transaction.isError}
              isSuccess={stateEditAudioChat.transaction.isSuccess}
            >
              Updating rally
            </DeploymentStep>
          </li>
        </ol>
        {[
          stateEditAudioChat.transaction,
          stateEditAudioChat.contract,
          stateEditAudioChat.uploadImage,
          stateEditAudioChat.uploadData,
        ].filter((slice) => slice.isError)?.length > 0 && (
          <div className="mt-6 animate-appear">
            {[
              stateEditAudioChat.transaction,
              stateEditAudioChat.contract,
              stateEditAudioChat.uploadImage,
              stateEditAudioChat.uploadData,
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
        {stateEditAudioChat.transaction?.isSuccess && stateTxUi.rallyId && (
          <div className="animate-appear space-y-4 mt-6">
            <Notice>
              🎉 Your rally was updated successfully ! <br />
              <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', stateTxUi.rallyId)}>
                <a>
                  Check it <span className="underline hover:no-underline">here</span>
                </a>
              </Link>
              <br />
              <span>Please note that the changes might take a few seconds to be reflected.</span>
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

export default FormEditAudioChat
