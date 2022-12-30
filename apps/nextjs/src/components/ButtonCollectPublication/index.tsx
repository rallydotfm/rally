import { IconSpinner } from '@components/Icons'
import useCreateLensCollectPublication from '@hooks/useCreateLensCollectPublication'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'

export const ButtonCollectPublication = (props: any) => {
  const { children, idPublication, disabled, optionsCollectMutation, ...rest } = props
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const { mutationCollectPublication } = useCreateLensCollectPublication(optionsCollectMutation)
  return (
    <button
      {...rest}
      disabled={
        disabled ||
        mutationCollectPublication?.isLoading ||
        !queryLensProfile?.data?.id ||
        !isSignedIn ||
        (isSignedIn && !queryLensProfile?.data?.id)
          ? true
          : false
      }
      title="Collect this publication"
      type="button"
      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        mutationCollectPublication.mutateAsync({
          publicationId: idPublication,
        })
      }}
    >
      {mutationCollectPublication.isLoading ? <IconSpinner className="animate-spin" /> : <>{children}</>}
    </button>
  )
}

export default ButtonCollectPublication
