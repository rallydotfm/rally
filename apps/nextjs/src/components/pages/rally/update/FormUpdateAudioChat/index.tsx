import FormAudioChat from '../../FormAudioChat'
import { useSmartContract, useStoreTxUi } from '@components/pages/rally/FormAudioChat/useSmartContract'
import useForm from '@components/pages/rally/FormAudioChat/useForm'
import { useUnmountEffect } from '@react-hookz/web'
import DialogModal from '@components/DialogModal'
import { IconSpinner } from '@components/Icons'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { ROUTE_DASHBOARD, ROUTE_RALLY_VIEW } from '@config/routes'
import Link from 'next/link'
import Button from '@components/Button'
import Notice from '@components/Notice'
import button from '@components/Button/styles'
import { useEffect } from 'react'

export const FormUpdateAudioChat = (props: any) => {
  const { values } = props
  const stateTxUi = useStoreTxUi()
  const { onSubmitNewAudioChat, stateNewAudioChat } = useSmartContract(stateTxUi)
  const { formAudioChat, apiInputRallyTags } = useForm({
    onSubmit: (values: any) => onSubmitNewAudioChat(values),
    initialValues: {
      rally_is_private: values.is_private,
      rally_has_cohosts: values.has_cohosts,
      rally_is_recorded: values.will_be_recorded,
      rally_tags: values.tags,
      rally_cohosts: values.cohosts_list,
      rally_name: values.name,
      rally_description: values.description,
      rally_start_at: values.datetime_start_at.toISOString().substring(0, 16),
      rally_image_src: `https://ipfs.io/ipfs/${values?.image}`,
      rally_access_control_guilds:
        values.access_control?.guilds.map((guild: any) => ({
          guild_id: guild.guild_id,
          roles: guild.roles.map((role: any) => role),
        })) ?? [],
      rally_access_control_whitelist: values.access_control.whitelist,
    },
  })
  useEffect(() => {
    stateTxUi.setFileRallyCID(values.cid)
    stateTxUi.setImageRallyCID(values.image)
  }, [])
  useUnmountEffect(() => {
    stateTxUi.resetState()
  })
  return (
    <FormAudioChat
      storeForm={formAudioChat}
      apiInputRallyTags={apiInputRallyTags}
      state={stateNewAudioChat}
      labelButtonSubmit="Update rally"
      labelButtonSubmitting="Updating..."
    />
  )
}

export default FormUpdateAudioChat
