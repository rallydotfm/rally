import { chain, useAccount, useContractWrite, useSignMessage } from 'wagmi'
import omit from '@helpers/omit'
import { pollUntilIndexed } from '@services/lens/indexer/pollUntilIndexed'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'

export function useFollowTypedData() {
  const account = useAccount()
  const followMessage = useSignMessage()
  const contractWriteFollow = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY,
    abi: lensHubProxyABI,
    functionName: 'followWithSig',
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
  })

  async function followProfile(profileToFollow) {
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
                  profileId: currentProfileId,
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
      const result = await createFollowTypedData(followProfileRequest)

      if (result?.data) {
        const typedData = result.data.createFollowTypedData.typedData
        const signature = followMessage.signMessage({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)

        const tx = await contractWriteFollow.writeAsync({
          addressOrName: CONTRACT_LENS_HUB_PROXY,
          contractInterface: abiLensHubProxy,
          functionName: 'followWithSig',
          args: {
            follower: account?.address,
            profileIds: typedData.value.profileIds,
            datas: typedData.value.datas,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          },
        })
        await pollUntilIndexed(tx.hash)
      } else {
        console.log('error')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    signIn,
    mutationSignChallengeMessage,
  }
}

export default useFollowTypedData
