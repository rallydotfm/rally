import { useAccount, useContractWrite, useMutation, useSignTypedData } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import { usePollTransaction } from '@hooks/usePollTransaction'
import { useQueryClient } from '@tanstack/react-query'
import { createCollectTypedData } from '@services/lens/collect/collect'
import type { CreateCollectRequest } from '@graphql/lens/generated'

export function useCreateLensCollectPublication(collectMutationOptions: any) {
  const queryClient = useQueryClient()
  const account = useAccount()
  const signTypedDataCollect = useSignTypedData()
  const contractWriteCollect = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY as `0x${string}`,
    abi: lensHubProxyABI,
    functionName: 'collectWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? polygonMumbai.id : polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Publication collected successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  async function collectPublication(values: any) {
    try {
      const collectRequest = {
        publicationId: values?.publicationId,
      }

      const result = await createCollectTypedData(collectRequest)
      if (result?.createCollectTypedData) {
        const typedData = result.createCollectTypedData.typedData
        const signature = await signTypedDataCollect.signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          //@ts-ignore
          types: omit(typedData?.types, '__typename'),
          //@ts-ignore
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)
        // @ts-ignore
        const tx = await contractWriteCollect.writeAsync({
          recklesslySetUnpreparedArgs: [
            {
              collector: account?.address as `0x${string}`,
              profileId: typedData.value.profileId,
              pubId: typedData.value.pubId,
              data: typedData.value.data,
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
        await mutationPollTransaction.mutateAsync(tx.hash)
        await queryClient.invalidateQueries(['publication-comment-feed', values?.publicationId])

        contractWriteCollect.reset()
        signTypedDataCollect.reset()
        mutationPollTransaction.reset()
      } else {
        //@ts-ignore
        toast.error(`Something went wrong, please try again.`)
      }
    } catch (e) {
      await queryClient.invalidateQueries(['publication-comment-feed', values?.publicationId])

      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong, please try again.`)
    }
  }
  const mutationCollectPublication = useMutation(collectPublication, collectMutationOptions)

  return {
    mutationCollectPublication,
  }
}

export default useCreateLensCollectPublication
