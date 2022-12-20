import Button from '@components/Button'
import useFollowTypedData from '@hooks/useFollowTypedData'
import type { ButtonProps } from '@components/Button'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount, useBalance } from 'wagmi'
import { chainId } from '@config/wagmi'

interface ButtonFollowOnLensProps extends ButtonProps {
  profile: any
}
export const ButtonFollowOnLens = (props: ButtonFollowOnLensProps) => {
  const { profile, disabled, ...rest } = props
  const account = useAccount()
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })

  const { followProfile, mutationPollTransaction, contractWriteFollow, signTypedDataFollow } = useFollowTypedData()

  return (
    <Button
      {...rest}
      disabled={
        disabled ||
        profile?.followModule?.type === 'RevertFollowModule' ||
        (profile?.followModule?.type === 'ProfileFollowModule' &&
          (queryUserProfileLens?.data === null ||
            queryUserProfileLens.isLoading ||
            queryUserProfileLens.isError ||
            !queryUserProfileLens?.data?.handle)) ||
        [(signTypedDataFollow?.isLoading, contractWriteFollow.isLoading, mutationPollTransaction?.isLoading)].includes(
          true,
        )
      }
      type="button"
      isLoading={[
        signTypedDataFollow?.isLoading,
        contractWriteFollow.isLoading,
        mutationPollTransaction?.isLoading,
      ].includes(true)}
      onClick={() => followProfile(profile)}
    >
      {signTypedDataFollow?.isLoading ? (
        'Sign message...'
      ) : contractWriteFollow?.isLoading ? (
        'Sign transaction...'
      ) : mutationPollTransaction?.isLoading ? (
        'Indexing...'
      ) : [signTypedDataFollow.isError, mutationPollTransaction.isError, contractWriteFollow.isError].includes(true) ? (
        'Try again'
      ) : (
        <>
          Follow{' '}
          {profile.followModule?.amount && (
            <span className="text-[0.9em] pis-1ex">{`(${profile.followModule?.amount?.value} ${profile.followModule?.amount?.asset?.symbol})`}</span>
          )}
        </>
      )}
    </Button>
  )
}

export default ButtonFollowOnLens
