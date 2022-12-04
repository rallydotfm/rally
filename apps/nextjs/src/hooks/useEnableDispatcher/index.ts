import { chain, useContractWrite, useMutation, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import enableDispatcherWithTypedData from '@services/lens/dispatcher/enable'
import { useQueryClient } from '@tanstack/react-query'
import { usePollTransaction } from '@hooks/usePollTransaction'

export function useEnableDispatcher(profile: { id: any; ownedBy: unknown }) {
  const queryClient = useQueryClient()
  const signTypedDataFollow = useSignTypedData()
  const contractWriteEnableDispatcher = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'setDispatcherWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Dispatcher enabled successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  async function enableDispatcher() {
    try {
      //@ts-ignore
      const result = await enableDispatcherWithTypedData({ profileId: profile.id })

      if (result?.createSetDispatcherTypedData?.typedData) {
        const typedData = result.createSetDispatcherTypedData.typedData
        const signature: any = await signTypedDataFollow.signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          //@ts-ignore
          types: omit(typedData?.types, '__typename'),
          //@ts-ignore
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)
        //@ts-ignore
        const tx = await contractWriteEnableDispatcher.writeAsync({
          recklesslySetUnpreparedArgs: [
            {
              profileId: typedData.value.profileId,
              dispatcher: typedData.value.dispatcher,
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
    enableDispatcher,
    contractWriteEnableDispatcher,
    signTypedDataFollow,
    mutationPollTransaction,
  }
}

export default useEnableDispatcher
