import { useAccount, useSigner, useSignTypedData } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import omit from '@helpers/omit'
import { lensFollowNFTContractABI } from '@rally/abi'
import toast from 'react-hot-toast'
import createUnfollowTypedData from '@services/lens/follow/unfollow'
import { usePollTransaction } from '@hooks/usePollTransaction'
import { useState } from 'react'
import { Contract } from 'ethers'
import type { Signer } from 'ethers'

export function useUnfollowTypedData() {
  const account = useAccount()
  const queryClient = useQueryClient()
  const { data: signer } = useSigner()
  const signTypedDataUnfollow = useSignTypedData()
  const [isWritingContractUnfollow, setIsWritingContractUnfollow] = useState(false)
  const [isErrorContractUnfollow, setIsErrorContractUnfollow] = useState(false)
  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Profile unfollowed successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  async function unfollowProfile(profile: any) {
    setIsErrorContractUnfollow(false)
    signTypedDataUnfollow.reset()
    mutationPollTransaction.reset()
    try {
      const result = await createUnfollowTypedData({ profile: profile.id })

      if (result?.createUnfollowTypedData) {
        const typedData = result.createUnfollowTypedData.typedData

        const followNftContract = new Contract(
          typedData.domain.verifyingContract,
          lensFollowNFTContractABI,
          signer as Signer,
        )

        setIsWritingContractUnfollow(true)
        const tx = await followNftContract.burn(typedData.value.tokenId)
        const newFollowersCount = (profile.stats.totalFollowers -= 1)

        //@ts-ignore
        await queryClient.cancelQueries({
          queryKey: ['lens-profile-by-handle', profile.handle],
          type: 'active',
          exact: true,
        })

        await queryClient.cancelQueries({
          queryKey: ['does-follow', profile.id, account?.address],
          type: 'active',
          exact: true,
        })

        await queryClient.cancelQueries({
          queryKey: ['lens-profile-by-wallet-address', profile.ownedBy],
          type: 'active',
          exact: true,
        })
        await mutationPollTransaction.mutateAsync(tx.hash)

        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-handle', profile.handle],
          type: 'active',
          exact: true,
        })
        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-wallet-address', profile.ownedBy],
          type: 'active',
          exact: true,
        })

        await queryClient.invalidateQueries({
          queryKey: ['does-follow', profile.id, account?.address],
          type: 'active',
          exact: true,
        })

        queryClient.setQueryData(['lens-profile-by-handle', profile.handle], (profileOldData: any) => ({
          //@ts-ignore
          ...profile,
          isFollowedByMe: false,
          stats: {
            ...profile.stats,
            totalFollowers: newFollowersCount,
          },
        }))

        queryClient.setQueryData(['lens-profile-by-wallet-address', profile.ownedBy], (profileOldData: any) => ({
          //@ts-ignore
          ...profile,
          isFollowedByMe: false,
          stats: {
            ...profile.stats,
            totalFollowers: newFollowersCount,
          },
        }))

        setIsWritingContractUnfollow(false)
      } else {
        console.error('error', result)
        //@ts-ignore
        toast.error(`Something went wrong, please try again.`)
        setIsErrorContractUnfollow(true)
        setIsWritingContractUnfollow(false)
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong, please try again.`)
      setIsWritingContractUnfollow(false)
    }
  }

  return {
    unfollowProfile,
    isWritingContractUnfollow,
    isErrorContractUnfollow,
    signTypedDataUnfollow,
    mutationPollTransaction,
  }
}

export default useUnfollowTypedData
