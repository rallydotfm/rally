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

export function useCreateLensPost() {
  const account = useAccount()
  const queryLensProfile: any = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const signTypedDataFollow = useSignTypedData()
  const contractWriteFollow = useContractWrite({
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

  async function publishPost(contentURI: string, values: any) {
    let collectModule = {}
    let referenceModule = {}

    try {
      const feeCollectParams = {
        amount: {
          currency:
            values?.collect_module_fee_currency_address !== ''
              ? values?.collect_module_fee_currency_address
              : process.env.NEXT_PUBLIC_CHAIN === 'mumbai'
              ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
              : '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          value: `${values?.collect_module_fee_amount}` ?? '0',
        },
        recipient: account?.address,
        referralFee: values?.collect_module_referral_fee_amount ?? 0,
        followerOnly: values?.collect_module === 1,
      }

      if (values.collect_module_is_time_limited === true) {
        if (values.collect_module_is_limited_amount === true) {
          //@ts-ignore
          collectModule.limitedTimedFeeCollectModule = {
            collectLimit: `${values.collect_module_amount}`,
            ...feeCollectParams,
          }
        } else {
          //@ts-ignore
          collectModule.timedFeeCollectModule = {
            ...feeCollectParams,
          }
        }
      }

      if (values.collect_module_is_limited_amount === true) {
        //@ts-ignore
        collectModule.limitedFeeCollectModule = {
          collectLimit: `${values.collect_module_amount}`,
          ...feeCollectParams,
        }
      }

      if (!values.collect_module_is_limited_amount === true && !values.isLimitedCollectDatetime) {
        //@ts-ignore
        collectModule.feeCollectModule = {
          ...feeCollectParams,
          followerOnly: values?.collect_module === 1,
        }
      }

      if (values?.collect_module === 0) {
        //@ts-ignore
        collectModule.freeCollectModule = {
          followerOnly: values?.collect_module === 1,
        }
      } else if (values?.collect_module === 2) {
        collectModule.revertCollectModule = true
      }
      if (values?.reference_module === 1) {
        //@ts-ignore
        referenceModule.followerOnlyReferenceModule = true
      } else if (values?.reference_module === -1 || values?.collect_module === 2) {
        //@ts-ignore
        referenceModule.followerOnlyReferenceModule = false
      } else {
        //@ts-ignore
        referenceModule.degreesOfSeparationReferenceModule = {
          commentsRestricted: true,
          mirrorsRestricted: true,
          degreesOfSeparation: values?.reference_module,
        }
      }

      const createPostRequest = {
        profileId: queryLensProfile?.data?.id,
        contentURI,
        collectModule,
        referenceModule,
      }
      const result = await createPostTypedData(createPostRequest)

      //@ts-ignore
      if (result?.createFollowTypedData) {
        //@ts-ignore
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

        console.log(tx)
        return tx
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
    publishPost,
    mutationPollTransaction,
    contractWriteFollow,
    signTypedDataFollow,
  }
}

export default useCreateLensPost
