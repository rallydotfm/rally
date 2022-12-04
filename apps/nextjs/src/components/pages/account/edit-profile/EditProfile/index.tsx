import Form from './FormProfileMetadata'
import useForm from './FormProfileMetadata/useForm'
import useSetProfileMetadata from '@hooks/useSetProfileMetadata'

interface EditProfileProps {
  profile: any
}
export const EditProfile = (props: EditProfileProps) => {
  const { profile } = props
  const {
    signTypedDataSetdMetadataProfile,
    mutationUploadMetadataFile,
    mutationUploadBannerFile,
    contractWriteSetProfiledMetadata,
    mutationPollTransaction,
    updateProfiledMetadata,
  } = useSetProfileMetadata(profile)
  const storeForm = useForm({
    initialValues: {
      lens_name: profile?.name ?? undefined,
      lens_bio: profile?.bio ?? undefined,
      lens_location:
        profile?.attributes.filter((attribute: any) => attribute.key === 'location')?.[0]?.value ?? undefined,
      lens_website:
        profile?.attributes.filter((attribute: any) => attribute.key === 'website')?.[0]?.value ?? undefined,
      lens_twitter_handle:
        profile?.attributes.filter((attribute: any) => attribute.key === 'twitter')?.[0]?.value ?? undefined,
      lens_banner_image_file: undefined,
      lens_banner_image_src: profile?.coverPicture?.original?.url ?? undefined,
    },
    onSubmit: async (values: any) => {
      await updateProfiledMetadata(values)
    },
  })
  return (
    <div className="animate-appear">
      <Form
        labelCta={
          mutationUploadBannerFile.isLoading
            ? 'Uploading banner...'
            : mutationUploadMetadataFile.isLoading
            ? 'Uploading metadata...'
            : signTypedDataSetdMetadataProfile.isLoading
            ? 'Sign message...'
            : contractWriteSetProfiledMetadata.isLoading
            ? 'Sign transaction...'
            : mutationPollTransaction.isLoading
            ? 'Indexing...'
            : [
                signTypedDataSetdMetadataProfile.isLoading,
                mutationUploadMetadataFile.isError,
                mutationUploadBannerFile.isError,
                contractWriteSetProfiledMetadata.isError,
                mutationPollTransaction.isError,
              ].includes(true)
            ? 'Try again'
            : 'Edit profile'
        }
        isLoading={[
          signTypedDataSetdMetadataProfile.isLoading,
          mutationUploadMetadataFile.isLoading,
          mutationUploadBannerFile.isLoading,
          contractWriteSetProfiledMetadata.isLoading,
          mutationPollTransaction.isLoading,
        ].includes(true)}
        isError={[
          signTypedDataSetdMetadataProfile.isLoading,
          mutationUploadMetadataFile.isError,
          mutationUploadBannerFile.isError,
          contractWriteSetProfiledMetadata.isError,
          mutationPollTransaction.isError,
        ].includes(true)}
        storeForm={storeForm}
      />
    </div>
  )
}

export default EditProfile
