import { chain, useAccount, useContractWrite, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import createPostTypedData from '@services/lens/publications/post'
import { usePollTransaction } from '@hooks/usePollTransaction'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { pollUntilIndexed } from '@services/lens/indexer/pollUntilIndexed'
import { utils, BigNumber } from 'ethers'
import createPostViaDispatcherRequest from '@services/lens/publications/postViaDispatcher'
import { CreatePublicPostRequest } from '@graphql/lens/generated'
import { useMutation } from '@tanstack/react-query'

export function useCreateLensPost() {
  const account = useAccount()
  const queryLensProfile: any = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const signTypedDataPost = useSignTypedData()
  const contractWritePost = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'postWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Publication created successfully!`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  const mutationCreatePostViaDispatcher = useMutation(
    async (request: CreatePublicPostRequest) => await createPostViaDispatcherRequest(request),
  )

  async function publishPost(contentURI: string, values: any) {
    let collectModule: any = {}
    let referenceModule: any = {}

    try {
      const profileId = queryLensProfile?.data?.id
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

      const createPostRequest = {
        profileId,
        contentURI,
        collectModule,
        referenceModule,
      }

      if (queryLensProfile?.data?.dispatcher && queryLensProfile?.data?.dispatcher !== null) {
        const result = await mutationCreatePostViaDispatcher.mutateAsync(createPostRequest)
        if (result?.createPostViaDispatcher) {
          //@ts-ignore
          const indexedResult = await pollUntilIndexed({ txHash: result?.createPostViaDispatcher?.txHash })
          const logs = indexedResult.txReceipt!.logs
          const topicId = utils.id('PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)')
          const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId)
          let profileCreatedEventLog = profileCreatedLog!.topics
          //@ts-ignore
          const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0]
          return `${profileId + '-' + BigNumber.from(publicationId).toHexString()}`
        } else {
          toast.error(`Something went wrong, please try again.`)
        }
      } else {
        const result = await createPostTypedData(createPostRequest)
        if (result?.createPostTypedData) {
          const typedData = result.createPostTypedData.typedData
          const signature = await signTypedDataPost.signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            //@ts-ignore
            types: omit(typedData?.types, '__typename'),
            //@ts-ignore
            value: omit(typedData?.value, '__typename'),
          })

          const { v, r, s } = splitSignature(signature)
          //@ts-ignore
          const tx = await contractWritePost.writeAsync({
            recklesslySetUnpreparedArgs: [
              {
                profileId: typedData.value.profileId,
                contentURI: typedData.value.contentURI,
                collectModule: typedData.value.collectModule,
                collectModuleInitData: typedData.value.collectModuleInitData,
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
          const indexedResult = await pollUntilIndexed({ txHash: tx.hash })
          const logs = indexedResult.txReceipt!.logs
          const topicId = utils.id('PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)')
          const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId)
          let profileCreatedEventLog = profileCreatedLog!.topics
          //@ts-ignore
          const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0]
          return `${profileId + '-' + BigNumber.from(publicationId).toHexString()}`
        } else {
          //@ts-ignore
          toast.error(`Something went wrong, please try again.`)
        }
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong, please try again.`)
    }
  }

  return {
    publishPost,
    mutationPollTransaction,
    contractWritePost,
    signTypedDataPost,
    mutationCreatePostViaDispatcher,
  }
}

export default useCreateLensPost
