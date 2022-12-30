import createSetProfileMetadataTypedData from '@services/lens/profile/setProfileMetadata'
import { chain, useContractWrite, useSignTypedData } from 'wagmi'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_PERIPHERY } from '@config/contracts'
import { lensPeripheryABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { v4 as uuidv4 } from 'uuid'
import { usePollTransaction } from '@hooks/usePollTransaction'

export function useSetProfileMetadata(profile: any) {
  const signTypedDataSetdMetadataProfile = useSignTypedData()
  const queryClient = useQueryClient()

  const mutationUploadBannerFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })

  const mutationUploadMetadataFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: `Your profile was updated successfully.`,
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  const contractWriteSetProfiledMetadata = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_PERIPHERY,
    abi: lensPeripheryABI,
    functionName: 'setProfileMetadataURIWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? chain.polygonMumbai.id : chain.polygon.id,
    onError(e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message)
    },
  })

  async function updateProfiledMetadata(values: {
    lens_banner_image_file: { name: string | undefined }
    lens_banner_image_src: string | undefined
    lens_name: string | undefined
    lens_bio: string | undefined
    lens_location: string | undefined
    lens_twitter_handle: string | undefined
    lens_website: string | undefined
  }) {
    mutationPollTransaction.reset()
    try {
      let cidBanner = profile.cover_picture?.original?.url
      if (values?.lens_banner_image_file) {
        //@ts-ignore
        cidBanner = await mutationUploadBannerFile.mutateAsync(values?.lens_banner_image_file)
      }

      const previousProfileAttributes = profile.attributes.filter(
        (attr: { key: string }) => !['location', 'twitter', 'website'].includes(attr.key),
      )
      const profileMetadata: any = {
        name: values?.lens_name ?? profile.name,
        bio: values?.lens_bio ?? profile.bio,
        cover_picture:
          cidBanner && values?.lens_banner_image_file?.name
            ? `https://${cidBanner}.ipfs.w3s.link/${values?.lens_banner_image_file?.name}`
            : values?.lens_banner_image_src && profile?.coverPicture?.original?.url
            ? profile?.coverPicture?.original?.url
            : null,
        attributes: [
          ...previousProfileAttributes,
          {
            traitType: 'string',
            key: 'location',
            value:
              values?.lens_location ??
              profile.attributes.filter((attr: { key: string }) => attr.key === 'location')?.[0]?.value,
          },
          {
            traitType: 'string',
            key: 'twitter',
            value:
              values?.lens_twitter_handle ??
              profile.attributes.filter((attr: { key: string }) => attr.key === 'twitter')?.[0]?.value,
          },
          {
            traitType: 'string',
            key: 'website',
            value:
              values?.lens_website ??
              profile.attributes.filter((attr: { key: string }) => attr.key === 'website')?.[0]?.value,
          },
        ],
        version: '1.0.0',
        metadata_id: uuidv4(),
      }

      const metadataJSON = new File([JSON.stringify(profileMetadata)], 'data.json', {
        type: 'application/json',
      })

      //@ts-ignore
      const metadataCID = await mutationUploadMetadataFile.mutateAsync(metadataJSON)
      const createProfileMetadataRequest = {
        profileId: profile.id,
        metadata: `https://${metadataCID}.ipfs.w3s.link/data.json`,
      }

      const result = await createSetProfileMetadataTypedData(createProfileMetadataRequest)

      const typedData = result.createSetProfileMetadataTypedData.typedData
      const signedResult = await signTypedDataSetdMetadataProfile.signTypedDataAsync({
        domain: omit(typedData?.domain, '__typename'),
        //@ts-ignore
        types: omit(typedData?.types, '__typename'),
        //@ts-ignore
        value: omit(typedData?.value, '__typename'),
      })

      const { v, r, s } = splitSignature(signedResult)
      //@ts-ignore
      const tx = await contractWriteSetProfiledMetadata.writeAsync({
        recklesslySetUnpreparedArgs: [
          {
            profileId: typedData.value.profileId,
            metadata: createProfileMetadataRequest.metadata,
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
      await queryClient.invalidateQueries({
        queryKey: ['lens-profile-by-handle', profile.handle],
        refetchType: 'active',
      })
      await queryClient.invalidateQueries({
        queryKey: ['lens-profile-by-wallet-address', profile.ownedBy],
        refetchType: 'active',
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    signTypedDataSetdMetadataProfile,
    mutationUploadMetadataFile,
    mutationUploadBannerFile,
    contractWriteSetProfiledMetadata,
    updateProfiledMetadata,
    mutationPollTransaction,
  }
}

export default useSetProfileMetadata
