import createSetFollowModuleTypedData from '@services/lens/follow/setFollowModule'
import { useContractWrite, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import { useQueryClient } from '@tanstack/react-query'
import { usePollTransaction } from '@hooks/usePollTransaction'
import { polygonMumbai, polygon } from 'wagmi/chains'

export const FOLLOW_MODULE_TYPES = {
  FREE: 'free',
  FEE: 'fee',
  REVERT: 'revert',
  PROFILE: 'profile',
}

export function useSetFollowModule(profile: any) {
  const queryClient = useQueryClient()
  const signTypedDataSetFollowModule = useSignTypedData()
  const mutationPollTransaction = usePollTransaction({
    messageSuccess: 'Your membership settings were updated successfully.',
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  const contractWriteSetFollowModule = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY as `0x${string}`,
    abi: lensHubProxyABI,
    functionName: 'setFollowModuleWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? polygonMumbai.id : polygon.id,
    onError(err) {
      console.error('some error here', err.message)
    },
  })

  async function setFollowModule(values: any) {
    const setFollowModuleRequest = {
      profileId: profile.id,
      followModule: {},
    }
    switch (values.type) {
      case FOLLOW_MODULE_TYPES.FEE:
        setFollowModuleRequest.followModule = {
          feeFollowModule: {
            amount: {
              currency: values.currency_address,
              value: `${values.fee_amount}`,
            },
            recipient: values?.recipient_address,
          },
        }
        break
      case FOLLOW_MODULE_TYPES.FREE:
        setFollowModuleRequest.followModule = {
          freeFollowModule: true,
        }
        break
      case FOLLOW_MODULE_TYPES.REVERT:
        setFollowModuleRequest.followModule = {
          revertFollowModule: true,
        }
        break

      case FOLLOW_MODULE_TYPES.PROFILE:
        setFollowModuleRequest.followModule = {
          profileFollowModule: true,
        }
        break
    }
    try {
      const result = await createSetFollowModuleTypedData(setFollowModuleRequest)
      const typedData = result?.createSetFollowModuleTypedData?.typedData

      const signature = await signTypedDataSetFollowModule.signTypedDataAsync({
        domain: omit(typedData?.domain, '__typename'),
        //@ts-ignore
        types: omit(typedData?.types, '__typename'),
        //@ts-ignore
        value: omit(typedData?.value, '__typename'),
      })

      const { v, r, s } = splitSignature(signature)
      //@ts-ignore
      const tx = await contractWriteSetFollowModule.writeAsync({
        recklesslySetUnpreparedArgs: [
          {
            profileId: typedData.value.profileId,
            followModule: typedData.value.followModule,
            followModuleInitData: typedData.value.followModuleInitData,
            sig: {
              v,
              r: r as `0x${string}`,
              s: s as `0x${string}`,
              deadline: typedData.value.deadline,
            },
          },
        ],
      })
      //@ts-ignore
      mutationPollTransaction.mutate(tx.hash)
      await queryClient.invalidateQueries({ queryKey: ['lens-profile-by-wallet-address', profile.ownedBy] })
      await queryClient.invalidateQueries({ queryKey: ['lens-profile-by-handle', profile.handle] })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    setFollowModule,
    mutationPollTransaction,
    contractWriteSetFollowModule,
    signTypedDataSetFollowModule,
  }
}

export default useSetFollowModule
