import Button from '@components/Button'
import useUnfollowTypedData from '@hooks/useUnfollowTypedData'

export const ButtonUnfollowOnLens = (props) => {
  const { profile, disabled, ...rest } = props
  const { unfollowProfile, isWritingContractUnfollow, isErrorContractUnfollow, signTypedDataUnfollow } =
    useUnfollowTypedData()

  return (
    <Button
      {...rest}
      disabled={disabled || [signTypedDataUnfollow?.isLoading, isWritingContractUnfollow].includes(true)}
      isLoading={[signTypedDataUnfollow?.isLoading, isWritingContractUnfollow].includes(true)}
      onClick={() => unfollowProfile(profile)}
    >
      {signTypedDataUnfollow?.isLoading
        ? 'Sign message...'
        : isWritingContractUnfollow
        ? 'Sign transaction...'
        : [signTypedDataUnfollow.isError || isErrorContractUnfollow].includes(true)
        ? 'Try again'
        : 'Unfollow'}
    </Button>
  )
}

export default ButtonUnfollowOnLens
