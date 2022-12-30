import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import { useEffect, useState } from 'react'
import { CameraIcon } from '@heroicons/react/20/solid'
import { useAccount } from 'wagmi'
import { useSetProfileImage } from '@hooks/useSetProfileImage'
import Notice from '@components/Notice'
export const DialogModalEditProfilePicture = (props: any) => {
  const { profile, ...dialogProps } = props
  const account = useAccount()

  const {
    signTypedDataSetImageProfile,
    mutationUploadImageFile,
    contractWriteSetProfileImage,
    updateProfileImage,
    mutationPollTransaction,
    imageFile,
    setImageFile,
    imageSrc,
    setImageSrc,
  } = useSetProfileImage(profile)

  useEffect(() => {
    if (!dialogProps.isOpen) {
      setImageFile(undefined)
      setImageSrc(undefined)
      mutationPollTransaction.reset()
    }
  }, [dialogProps.isOpen])

  return (
    <DialogModal title="Change profile picture" {...dialogProps}>
      <p className="font-bold text-center py-6">Upload a new profile picture</p>
      <div className="mt-4 flex flex-col relative">
        <div className="w-56 xs:w-72 mx-auto rounded-full aspect-square overflow-hidden relative bg-neutral-1">
          <input
            disabled={!account?.address}
            onChange={(e) => {
              //@ts-ignore
              const src = URL.createObjectURL(e.target.files[0])
              //@ts-ignore
              setImageFile(e.target.files[0])
              //@ts-ignore
              setImageSrc(src)
            }}
            className="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
            type="file"
            accept="image/*"
            name="lens_profile_picture"
            id="lens_profile_picture"
            required
            aria-describedby="input-lens_profile_picture-description input-lens_profile_picture-helpblock"
          />
          <div className="absolute w-full h-full rounded-md inset-0 z-20 bg-neutral-3 bg-opacity-20 flex items-center justify-center">
            <CameraIcon className="w-10 text-white" />
          </div>

          {imageSrc && (
            <img
              alt=""
              loading="lazy"
              width="112"
              height="112"
              className="absolute w-full h-full object-cover block z-10 inset-0"
              src={imageSrc?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
            />
          )}
        </div>

        {imageFile && (
          <Button
            disabled={!account?.address}
            type="button"
            className="mt-2 w-auto mx-auto"
            intent="negative-ghost"
            scale="xs"
            onClick={() => {
              setImageFile(undefined)
              setImageSrc(undefined)
            }}
          >
            Delete image
          </Button>
        )}

        {imageFile && (
          <Button
            disabled={
              !account?.address ||
              [
                signTypedDataSetImageProfile.isLoading,
                mutationUploadImageFile.isLoading,
                contractWriteSetProfileImage.isLoading,
                mutationPollTransaction.isLoading,
              ].includes(true)
            }
            type="button"
            className="mt-3 mb-4 w-auto mx-auto"
            intent="primary"
            isLoading={[
              signTypedDataSetImageProfile.isLoading,
              mutationUploadImageFile.isLoading,
              contractWriteSetProfileImage.isLoading,
              mutationPollTransaction.isLoading,
            ].includes(true)}
            onClick={() => {
              updateProfileImage(imageFile)
            }}
          >
            {mutationUploadImageFile.isLoading
              ? 'Uploading image...'
              : signTypedDataSetImageProfile.isLoading
              ? 'Sign message...'
              : contractWriteSetProfileImage.isLoading
              ? 'Sign transaction...'
              : mutationPollTransaction.isLoading
              ? 'Indexing...'
              : [
                  mutationPollTransaction.isError,
                  signTypedDataSetImageProfile.isError,
                  mutationUploadImageFile.isError,
                  contractWriteSetProfileImage.isError,
                ].includes(true)
              ? 'Try again'
              : 'Upload new profile picture'}
          </Button>
        )}
        {mutationPollTransaction.isSuccess && (
          <Notice className="animate-appear mt-6">Your new profile picture was updated succesfully.</Notice>
        )}
        <Button onClick={() => dialogProps.setIsOpen(false)} intent="neutral-ghost" scale="xs" className="mx-auto mt-6">
          Go back
        </Button>
      </div>
    </DialogModal>
  )
}

export default DialogModalEditProfilePicture
