import { useSigner, useSignTypedData } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { lensFollowNFTContractABI } from '@rally/abi'
import toast from 'react-hot-toast'
import createUnfollowTypedData from '@services/lens/follow/unfollow'
import { useState } from 'react'
import { Contract } from 'ethers'
import useStoreLensIndexer from '@hooks/useStoreLensIndexer'
import type { Signer } from 'ethers'

export function useUnfollowTypedData() {
  const queryClient = useQueryClient()
  const { data: signer } = useSigner()
  const signTypedDataUnfollow = useSignTypedData()
  const poll = useStoreLensIndexer((state: any) => state.poll)
  const [isWritingContractUnfollow, setIsWritingContractUnfollow] = useState(false)
  const [isErrorContractUnfollow, setIsErrorContractUnfollow] = useState(false)

  async function unfollowProfile(profile: any) {
    setIsErrorContractUnfollow(false)
    try {
      const result = await createUnfollowTypedData({ profile: profile.id })

      if (result?.createUnfollowTypedData) {
        const typedData = result.createUnfollowTypedData.typedData

        const signature = await signTypedDataUnfollow.signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)
        const sig = {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        }

        const followNftContract = new Contract(
          typedData.domain.verifyingContract,
          lensFollowNFTContractABI,
          signer as Signer,
        )

        setIsWritingContractUnfollow(true)
        const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig)
        poll({
          hash: tx.hash,
          messageSuccess: `You now follow ${profile?.name}`,
          messageError: 'Something went wrong, please try again.',
        })

        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-handle', profile.handle],
          type: 'active',
          exact: true,
        })
        queryClient.setQueryData(['lens-profile-by-handle', profile.handle], (profileOldData: any) => ({
          //@ts-ignore
          ...profileOldData,
          isFollowedByMe: false,
          stats: {
            ...profileOldData.stats,
            totalFollowers: (profileOldData.stats.totalFollowers -= 1),
          },
        }))

        setIsWritingContractUnfollow(false)
      } else {
        console.log('error', result)
        //@ts-ignore
        toast.error(`Something went wrong: ${result?.error}`)
        setIsErrorContractUnfollow(true)
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong: ${e?.cause ?? e}`)
    }
  }

  return {
    unfollowProfile,
    isWritingContractUnfollow,
    isErrorContractUnfollow,
    signTypedDataUnfollow,
  }
}

export default useUnfollowTypedData
