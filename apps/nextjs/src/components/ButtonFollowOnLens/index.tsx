import Button from '@components/Button'
import useFollowTypedData from '@hooks/useFollowTypedData'

export const ButtonFollowOnLens = (props) => {
  const { profile, disabled, ...rest } = props

  const { followProfile, signTypedDataFollow, txWriteFollow, contractWriteFollow } = useFollowTypedData()
  return (
    <Button
      {...rest}
      disabled={
        disabled ||
        [signTypedDataFollow?.isLoading, contractWriteFollow.isLoading, txWriteFollow?.isLoading].includes(true)
      }
      isLoading={[signTypedDataFollow?.isLoading, contractWriteFollow.isLoading, txWriteFollow?.isLoading].includes(
        true,
      )}
      onClick={() => followProfile(profile)}
    >
      {signTypedDataFollow?.isLoading
        ? 'Sign message...'
        : contractWriteFollow?.isLoading
        ? 'Sign transaction...'
        : txWriteFollow?.isLoading
        ? 'Indexing...'
        : [signTypedDataFollow.isError, txWriteFollow.isError, contractWriteFollow.isError].includes(true)
        ? 'Try again'
        : 'Follow'}
    </Button>
  )
}

export default ButtonFollowOnLens
