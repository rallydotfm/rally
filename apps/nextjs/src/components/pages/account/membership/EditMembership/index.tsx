import useSetFollowModule, { FOLLOW_MODULE_TYPES } from '@hooks/useSetFollowModule'
import FormSetMembership from './FormSetMembership'
import useForm from './FormSetMembership/useForm'

interface EditMembershipProps {
  profile: any
}

export const EditMembership = (props: EditMembershipProps) => {
  const { profile } = props
  const { setFollowModule, mutationPollTransaction, contractWriteSetFollowModule, signTypedDataSetFollowModule } =
    useSetFollowModule(profile)
  const storeForm = useForm({
    onSubmit: (values: any) => setFollowModule(values),
    initialValues: {
      type:
        profile.followModule === null
          ? FOLLOW_MODULE_TYPES.FREE
          : profile?.followModule?.type === 'FeeFollowModule'
          ? FOLLOW_MODULE_TYPES.FEE
          : profile?.followModule?.type === 'RevertFollowModule'
          ? FOLLOW_MODULE_TYPES.REVERT
          : profile?.followModule?.type === 'ProfileFollowModule'
          ? FOLLOW_MODULE_TYPES.PROFILE
          : FOLLOW_MODULE_TYPES.FREE,
      currency_address: profile?.followModule?.amount?.asset?.address ?? '',
      fee_amount: parseFloat(profile?.followModule?.amount?.value) ?? '',
      recipient_address: profile?.followModule?.recipient ?? '',
    },
  })

  return (
    <FormSetMembership
      labelCta={
        signTypedDataSetFollowModule.isLoading
          ? 'Sign message...'
          : contractWriteSetFollowModule.isLoading
          ? 'Sign transaction...'
          : mutationPollTransaction.isLoading
          ? 'Indexing...'
          : [
              signTypedDataSetFollowModule.isLoading,
              contractWriteSetFollowModule.isError,
              mutationPollTransaction.isError,
            ].includes(true)
          ? 'Try again'
          : 'Edit membership'
      }
      isLoading={[
        signTypedDataSetFollowModule.isLoading,
        contractWriteSetFollowModule.isLoading,
        mutationPollTransaction.isLoading,
      ].includes(true)}
      isError={[
        signTypedDataSetFollowModule.isLoading,
        contractWriteSetFollowModule.isError,
        mutationPollTransaction.isError,
      ].includes(true)}
      storeForm={storeForm}
    />
  )
}

export default EditMembership
