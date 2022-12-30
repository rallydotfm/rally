import { chain, useAccount, useContractWrite, useMutation, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import { usePollTransaction } from '@hooks/usePollTransaction'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { v4 as uuidv4 } from 'uuid'
import { PublicationMainFocus } from '@graphql/lens/generated'
import { useStoreBundlr } from '@hooks/useBundlr'
import { useQueryClient } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import createCommentViaDispatcher from '@services/lens/publications/commentViaDispatcher'
import createCommentTypedData from '@services/lens/publications/comment'
import type { CreatePublicCommentRequest } from '@graphql/lens/generated'

export function useCreateLensComment() {
  const queryClient = useQueryClient()
  const account = useAccount()
  const bundlr = useStoreBundlr((state: any) => state.bundlr)

  const queryLensProfile: any = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const signTypedDataComment = useSignTypedData()
  const contractWriteComment = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'commentWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationCreateCommentViaDispatcher = useMutation(
    async (request: CreatePublicCommentRequest) => await createCommentViaDispatcher(request),
  )
  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Comment sent successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  const mutationUploadJsonFile = useMutation(async (data: string) => {
    try {
      const txn = await bundlr.upload(data, {
        tags: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'Rally' },
        ],
      })
      return txn?.id
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong while uploading your recording file.')
    }
  })

  async function publishComment(values: any) {
    let collectModule: any = {}
    let referenceModule: any = {}

    try {
      await queryClient.cancelQueries(['publication-comment-feed', values?.publicationId])
      const previousCommentsFeedData: any = queryClient.getQueryData([
        'publication-comment-feed',
        values?.publicationId,
      ])

      const feeCollectParams = {
        amount: {
          currency:
            values?.collect_module_fee_currency_address !== ''
              ? values?.collect_module_fee_currency_address
              : process.env.NEXT_PUBLIC_CHAIN === 'mumbai'
              ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
              : '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          value: `${values?.collect_module_fee_amount !== '' ? values?.collect_module_fee_amount : 0}` ?? '0',
        },
        recipient: account?.address,
        referralFee: values?.collect_module_referral_fee_amount ?? 0,
        followerOnly: values?.collect_module === 1,
      }

      if (values.collect_module_is_time_limited === true && values.collect_module_has_fee) {
        if (values.collect_module_is_limited_amount === true) {
          collectModule.limitedTimedFeeCollectModule = {
            collectLimit: `${values.collect_module_amount}`,
            ...feeCollectParams,
          }
        } else {
          collectModule.timedFeeCollectModule = {
            ...feeCollectParams,
          }
        }
      }

      if (values.collect_module_is_limited_amount === true && values.collect_module_has_fee) {
        collectModule.limitedFeeCollectModule = {
          collectLimit: `${values.collect_module_amount}`,
          ...feeCollectParams,
        }
      }

      if (
        values.collect_module_has_fee &&
        !values.collect_module_is_limited_amount === true &&
        !values.collect_module_is_time_limited
      ) {
        collectModule.feeCollectModule = {
          ...feeCollectParams,
          followerOnly: values?.collect_module === 1,
        }
      }

      if (
        !collectModule?.limitedFeeCollectModule &&
        !collectModule?.timedFeeCollectModule &&
        !collectModule?.feeCollectModule
      ) {
        if (values?.collect_module === 0 && !values.collect_module_has_fee) {
          collectModule.freeCollectModule = {
            followerOnly: values?.collect_module === 1,
          }
        } else {
          collectModule.revertCollectModule = true
        }
      }
      if (values?.reference_module === 1) {
        referenceModule.followerOnlyReferenceModule = true
      } else if (values?.reference_module === -1 || values?.collect_module === 2) {
        referenceModule.followerOnlyReferenceModule = false
      } else {
        referenceModule.degreesOfSeparationReferenceModule = {
          commentsRestricted: true,
          mirrorsRestricted: true,
          degreesOfSeparation: values?.reference_module,
        }
      }

      const profileId = queryLensProfile?.data?.id
      const metadata = {
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: uuidv4(),
        description: values?.publication_comment_content,
        locale: navigator.languages?.[0] ?? 'en-US',
        content: values?.publication_comment_content,
        external_url: null,
        image: null,
        imageMimeType: null,
        name: `Comment by @${queryLensProfile?.data?.handle}`,
        attributes: [],
        tags: [],
        appId: 'Rally',
      }

      const arweaveTxId = await mutationUploadJsonFile.mutateAsync(JSON.stringify(metadata))

      queryClient.setQueryData(['publication-comment-feed', values?.publicationId], (prev: any) => {
        const previousComments = previousCommentsFeedData.publications.items
        const updatedList = [
          {
            createdAt: formatISO(new Date()),
            id: metadata.metadata_id,
            profile: queryLensProfile?.data,
            stats: { totalAmountOfMirrors: 0, totalAmountOfCollects: 0, totalAmountOfComments: 0 },
            metadata,
            indexed: false,
          },
        ].concat(previousComments)
        const newData = {
          publications: {
            items: updatedList,
          },
        }
        return newData
      })

      const createCommentRequest = {
        profileId,
        publicationId: values?.publicationId,
        contentURI: `https://arweave.net/${arweaveTxId}`,
        collectModule,
        referenceModule,
      }
      if (queryLensProfile?.data?.dispatcher && queryLensProfile?.data?.dispatcher !== null) {
        const result = await mutationCreateCommentViaDispatcher.mutateAsync(createCommentRequest)

        if (result?.createCommentViaDispatcher) {
          //@ts-ignore
          await mutationPollTransaction.mutateAsync(result?.createCommentViaDispatcher?.txHash)
          await queryClient.invalidateQueries(['publication-comment-feed', values?.publicationId])
          mutationPollTransaction.reset()
          mutationCreateCommentViaDispatcher.reset()
        } else {
          //@ts-ignore
          toast.error(`Something went wrong, please try again.`)
        }
      } else {
        const result = await createCommentTypedData(createCommentRequest)
        if (result?.createCommentTypedData) {
          const typedData = result.createCommentTypedData.typedData
          const signature = await signTypedDataComment.signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            //@ts-ignore
            types: omit(typedData?.types, '__typename'),
            //@ts-ignore
            value: omit(typedData?.value, '__typename'),
          })

          const { v, r, s } = splitSignature(signature)
          //@ts-ignore
          const tx = await contractWriteComment.writeAsync({
            recklesslySetUnpreparedArgs: [
              {
                profileId: typedData.value.profileId,
                contentURI: typedData.value.contentURI,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                collectModule: typedData.value.collectModule,
                collectModuleInitData: typedData.value.collectModuleInitData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleInitData: typedData.value.referenceModuleInitData,
                referenceModuleData: typedData.value.referenceModuleData,
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

          contractWriteComment.reset()
          signTypedDataComment.reset()
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

  return {
    publishComment,
    mutationCreateCommentViaDispatcher,
    mutationPollTransaction,
    contractWriteComment,
    signTypedDataComment,
    mutationUploadJsonFile,
  }
}

export default useCreateLensComment
