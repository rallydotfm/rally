import { chain, useAccount, useContractWrite, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import toast from 'react-hot-toast'
import createFollowTypedData from '@services/lens/follow/follow'
import { useQueryClient } from '@tanstack/react-query'
import { usePollTransaction } from '@hooks/usePollTransaction'

export function useFollowTypedData() {
  const account = useAccount()
  const queryClient = useQueryClient()
  const queryLensProfile: any = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const signTypedDataFollow = useSignTypedData()
  const contractWriteFollow = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'followWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Profile followed successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
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
          //@ts-ignore
          types: omit(typedData?.types, '__typename'),
          //@ts-ignore
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
        await queryClient.cancelQueries({
          queryKey: ['lens-profile-by-handle', profileToFollow.handle],
          type: 'active',
          exact: true,
        })
        await queryClient.cancelQueries({
          queryKey: ['lens-profile-by-wallet-address', profileToFollow.ownedBy],
          type: 'active',
          exact: true,
        })

        await queryClient.cancelQueries({
          queryKey: ['does-follow', profileToFollow.id, account?.address],
          type: 'active',
          exact: true,
        })

        //@ts-ignore
        await mutationPollTransaction.mutateAsync(tx.hash)
        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-handle', profileToFollow.handle],
          type: 'active',
          exact: true,
        })
        const newFollowersCount = (profileToFollow.stats.totalFollowers += 1)
        queryClient.setQueryData(['lens-profile-by-handle', profileToFollow.handle], (profileOldData: any) => ({
          //@ts-ignore
          ...profileToFollow,
          isFollowedByMe: true,
          stats: {
            ...profileToFollow.stats,
            totalFollowers: newFollowersCount,
          },
        }))
        await queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-wallet-address', profileToFollow.ownedBy],
          type: 'active',
          exact: true,
        })

        await queryClient.invalidateQueries({
          queryKey: ['does-follow', profileToFollow.id, account?.address],
          type: 'active',
          exact: true,
        })

        queryClient.setQueryData(
          ['lens-profile-by-wallet-address', profileToFollow.ownedBy],
          (profileOldData: any) => ({
            //@ts-ignore
            ...profileToFollow,
            isFollowedByMe: true,
            stats: {
              ...profileToFollow.stats,
              totalFollowers: newFollowersCount,
            },
          }),
        )
      } else {
        //@ts-ignore
        toast.error(`Something went wrong, please try again.`)
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong, please try again.`)
    }
  }

  return {
    followProfile,
    mutationPollTransaction,
    contractWriteFollow,
    signTypedDataFollow,
  }
}

export default useFollowTypedData
