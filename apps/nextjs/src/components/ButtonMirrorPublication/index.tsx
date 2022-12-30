import { IconSpinner } from '@components/Icons'
import useCreateLensMirror from '@hooks/useCreateLensMirror'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'

export const ButtonMirrorPublication = (props: any) => {
  const { children, idPublication, disabled, optionsMirrorMutation, ...rest } = props
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const { mutationMirrorPublication } = useCreateLensMirror(optionsMirrorMutation)
  return (
    <button
      {...rest}
      isLoading={mutationMirrorPublication?.isLoading}
      disabled={
        disabled ||
        mutationMirrorPublication?.isLoading ||
        !queryLensProfile?.data?.id ||
        !isSignedIn ||
        (isSignedIn && !queryLensProfile?.data?.id)
          ? true
          : false
      }
      title="Mirror this publication"
      type="button"
      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        mutationMirrorPublication.mutateAsync({
          profileId: queryLensProfile?.data?.id,
          publicationId: idPublication,
        })
      }}
    >
      {mutationMirrorPublication.isLoading ? <IconSpinner className="animate-spin" /> : <>{children}</>}
    </button>
  )
}

export default ButtonMirrorPublication
