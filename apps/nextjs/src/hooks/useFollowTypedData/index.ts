import { chain, useAccount, useContractWrite, useSignTypedData, useWaitForTransaction } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import toast from 'react-hot-toast'
import createFollowTypedData from '@services/lens/follow/follow'
import { useQueryClient } from '@tanstack/react-query'
import { useStoreLensIndexer } from '@hooks/useStoreLensIndexer'

export function useFollowTypedData() {
  const account = useAccount()
  const poll = useStoreLensIndexer((state: any) => state.poll)
  const queryClient = useQueryClient()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, true)
  const signTypedDataFollow = useSignTypedData()
  const contractWriteFollow = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'followWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(err) {
      console.log('some error here', err.message)
    },
  })

  const txWriteFollow = useWaitForTransaction({
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    hash: contractWriteFollow?.data?.hash,
    onError(err) {
      toast.error(`Transaction failed with error: ${err.cause}`)
    },
  })

  async function followProfile(profileToFollow: any) {
    let followProfileRequest
    if (profileToFollow.followModule === null) {
      followProfileRequest = [
        {
          profile: profileToFollow.id,
        },
      ]
    } else {
      switch (profileToFollow.followModule.type) {
        case 'ProfileFollowModule':
          followProfileRequest = [
            {
              profile: profileToFollow.id,
              followModule: {
                profileFollowModule: {
                  profileId: queryLensProfile?.data?.id,
                },
              },
            },
          ]
          break
        case 'FeeFollowModule':
          followProfileRequest = [
            {
              profile: profileToFollow.id,
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: profileToFollow.followModule.amount.asset.address,
                    value: profileToFollow.followModule.amount.value,
                  },
                },
              },
            },
          ]
          break
      }
    }

    try {
      //@ts-ignore
      const result = await createFollowTypedData({ follow: followProfileRequest })

      if (result?.createFollowTypedData) {
        const typedData = result.createFollowTypedData.typedData
        const signature = await signTypedDataFollow.signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)
        //@ts-ignore
        const tx = await contractWriteFollow.writeAsync({
          recklesslySetUnpreparedArgs: [
            {
              follower: account?.address as `0x${string}`,
              profileIds: typedData.value.profileIds,
              datas: typedData.value.datas,
              sig: {
                v,
                r: r as `0x${string}`,
                s: s as `0x${string}`,
                deadline: typedData.value.deadline,
              },
            },
          ],
        })
        poll({
          hash: tx.hash,
          messageSuccess: `You now follow ${profileToFollow?.name}`,
          messageError: 'Something went wrong, please try again.',
        })

        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-handle', profileToFollow.handle],
          type: 'active',
          exact: true,
        })
        queryClient.setQueryData(['lens-profile-by-handle', profileToFollow.handle], (profileOldData: any) => ({
          //@ts-ignore
          ...profileOldData,
          isFollowedByMe: true,
          stats: {
            ...profileOldData.stats,
            totalFollowers: (profileOldData.stats.totalFollowers += 1),
          },
        }))
      } else {
        //@ts-ignore
        toast.error(`Something went wrong: ${result?.error}`)
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong: ${e?.cause ?? e}`)
    }
  }

  return {
    followProfile,
    txWriteFollow,
    contractWriteFollow,
    signTypedDataFollow,
  }
}

export default useFollowTypedData
