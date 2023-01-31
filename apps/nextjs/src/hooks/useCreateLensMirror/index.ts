import { useAccount, useContractWrite, useMutation, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import { usePollTransaction } from '@hooks/usePollTransaction'
import { useQueryClient } from '@tanstack/react-query'
import { createMirrorViaDispatcherRequest } from '@services/lens/publications/mirrorViaDispatcher'
import { createMirrorTypedData } from '@services/lens/publications/mirror'
import type { CreateMirrorRequest } from '@graphql/lens/generated'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { polygonMumbai, polygon } from 'wagmi/chains'

export function useCreateLensMirror(mirrorMutationOptions: any) {
  const queryClient = useQueryClient()
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })

  const signTypedDataMirror = useSignTypedData()
  const contractWriteMirror = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY as `0x${string}`,
    abi: lensHubProxyABI,
    functionName: 'mirrorWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? polygonMumbai.id : polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationCreateMirrorViaDispatcher = useMutation(
    async (request: CreateMirrorRequest) => await createMirrorViaDispatcherRequest(request),
  )
  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Publication mirrored successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  async function mirrorPublication(values: any) {
    try {
      const createMirrorRequest = {
        profileId: values?.profileId,
        publicationId: values?.publicationId,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      }
      if (queryLensProfile?.data?.dispatcher && queryLensProfile?.data?.dispatcher !== null) {
        const result = await mutationCreateMirrorViaDispatcher.mutateAsync(createMirrorRequest)

        if (result?.createMirrorViaDispatcher) {
          //@ts-ignore
          await mutationPollTransaction.mutateAsync(result?.createMirrorViaDispatcher?.txHash)
          await queryClient.invalidateQueries(['linked-lens-publication-by-id', values?.publicationId])
          mutationPollTransaction.reset()
          mutationCreateMirrorViaDispatcher.reset()
        } else {
          //@ts-ignore
          toast.error(`Something went wrong, please try again.`)
        }
      } else {
        const result = await createMirrorTypedData(createMirrorRequest)
        if (result?.createMirrorTypedData) {
          const typedData = result.createMirrorTypedData.typedData
          const signature = await signTypedDataMirror.signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            //@ts-ignore
            types: omit(typedData?.types, '__typename'),
            //@ts-ignore
            value: omit(typedData?.value, '__typename'),
          })

          const { v, r, s } = splitSignature(signature)
          // @ts-ignore
          const tx = await contractWriteMirror.writeAsync({
            recklesslySetUnpreparedArgs: [
              {
                profileId: typedData.value.profileId,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                referenceModuleData: typedData.value.referenceModuleData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleInitData: typedData.value.referenceModuleInitData,
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

          contractWriteMirror.reset()
          signTypedDataMirror.reset()
          mutationPollTransaction.reset()
        } else {
          //@ts-ignore
          toast.error(`Something went wrong, please try again.`)
        }
      }
    } catch (e) {
      await queryClient.invalidateQueries(['publication-comment-feed', values?.publicationId])

      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong, please try again.`)
    }
  }
  const mutationMirrorPublication = useMutation(mirrorPublication, mirrorMutationOptions)

  return {
    mutationMirrorPublication,
  }
}

export default useCreateLensMirror
