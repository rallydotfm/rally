import Button from '@components/Button'
import useUnfollowTypedData from '@hooks/useUnfollowTypedData'
import type { ButtonProps } from '@components/Button'

interface ButtonUnfollowOnLensProps extends ButtonProps {
  profile: any
}

export const ButtonUnfollowOnLens = (props: ButtonUnfollowOnLensProps) => {
  const { profile, disabled, ...rest } = props
  const {
    unfollowProfile,
    mutationPollTransaction,
    isWritingContractUnfollow,
    isErrorContractUnfollow,
    signTypedDataUnfollow,
  } = useUnfollowTypedData()

  return (
    <Button
      {...rest}
      disabled={
        disabled ||
        [mutationPollTransaction.isLoading, signTypedDataUnfollow?.isLoading, isWritingContractUnfollow].includes(true)
      }
      isLoading={[
        signTypedDataUnfollow?.isLoading,
        mutationPollTransaction.isLoading,
        isWritingContractUnfollow,
      ].includes(true)}
      onClick={() => unfollowProfile(profile)}
      type="button"
    >
      {signTypedDataUnfollow?.isLoading
        ? 'Sign message...'
        : isWritingContractUnfollow
        ? 'Sign transaction...'
        : mutationPollTransaction.isLoading
        ? 'Indexing...'
        : [mutationPollTransaction.isError || signTypedDataUnfollow.isError || isErrorContractUnfollow].includes(true)
        ? 'Try again'
        : 'Unfollow'}
    </Button>
  )
}

export default ButtonUnfollowOnLens
