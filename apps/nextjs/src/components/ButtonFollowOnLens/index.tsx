import Button from '@components/Button'
import useFollowTypedData from '@hooks/useFollowTypedData'
import type { ButtonProps } from '@components/Button'

interface ButtonFollowOnLensProps extends ButtonProps {
  profile: any
}
export const ButtonFollowOnLens = (props: ButtonFollowOnLensProps) => {
  const { profile, disabled, ...rest } = props

  const { followProfile, mutationPollTransaction, contractWriteFollow, signTypedDataFollow } = useFollowTypedData()
  return (
    <Button
      {...rest}
      disabled={
        disabled ||
        [signTypedDataFollow?.isLoading, contractWriteFollow.isLoading, mutationPollTransaction?.isLoading].includes(
          true,
        )
      }
      isLoading={[
        signTypedDataFollow?.isLoading,
        contractWriteFollow.isLoading,
        mutationPollTransaction?.isLoading,
      ].includes(true)}
      onClick={() => followProfile(profile)}
    >
      {signTypedDataFollow?.isLoading
        ? 'Sign message...'
        : contractWriteFollow?.isLoading
        ? 'Sign transaction...'
        : mutationPollTransaction?.isLoading
        ? 'Indexing...'
        : [signTypedDataFollow.isError, mutationPollTransaction.isError, contractWriteFollow.isError].includes(true)
        ? 'Try again'
        : 'Follow'}
    </Button>
  )
}

export default ButtonFollowOnLens
