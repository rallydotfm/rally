import createSetProfileImageUriTypedData from '@services/lens/profile/setProfileImage'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { useState } from 'react'
import { usePollTransaction } from '@hooks/usePollTransaction'

export function useSetProfileImage(profile: any) {
  const [cidImage, setCidImage] = useState(undefined)
  const [imageFile, setImageFile] = useState()
  const [imageSrc, setImageSrc] = useState(profile?.picture?.original?.url ?? undefined)

  const signTypedDataSetImageProfile = useSignTypedData()
  const queryClient = useQueryClient()
  const mutationUploadImageFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
      setCidImage(cid)
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })
  const mutationPollTransaction = usePollTransaction({
    messageSuccess: 'Your profile picture was updated successfully.',
    messageError: 'Something went wrong, please try again.',
    options: {
      onSuccess() {
        setImageFile(undefined)
        setImageSrc(undefined)
        setCidImage(undefined)
      },
    },
  })

  const contractWriteSetProfileImage = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY as `0x${string}`,
    abi: lensHubProxyABI,
    functionName: 'setProfileImageURIWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? polygonMumbai.id : polygon.id,
    onError(err) {
      console.error('some error here', err.message)
    },
  })

  async function updateProfileImage(file: any) {
    mutationPollTransaction.reset()
    try {
      let cid = cidImage
      if (!cid) {
        //@ts-ignore
        cid = await mutationUploadImageFile.mutateAsync(file)
      }
      const setProfileImageUriRequest = {
        profileId: profile.id,
        url: `https://${cid}.ipfs.w3s.link/${file.name}`,
      }
      const result = await createSetProfileImageUriTypedData(setProfileImageUriRequest)

      const typedData = result?.createSetProfileImageURITypedData?.typedData
      const signedResult = await signTypedDataSetImageProfile.signTypedDataAsync({
        domain: omit(typedData?.domain, '__typename'),
        //@ts-ignore
        types: omit(typedData?.types, '__typename'),
        //@ts-ignore
        value: omit(typedData?.value, '__typename'),
      })

      const typedDataSignedResult = result?.createSetProfileImageURITypedData?.typedData

      const { v, r, s } = splitSignature(signedResult)
      //@ts-ignore
      const tx = await contractWriteSetProfileImage.writeAsync({
        recklesslySetUnpreparedArgs: [
          {
            profileId: typedDataSignedResult.value.profileId,
            imageURI: typedDataSignedResult.value.imageURI,
            sig: {
              v,
              r: r as `0x${string}`,
              s: s as `0x${string}`,
              deadline: typedDataSignedResult.value.deadline,
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
    signTypedDataSetImageProfile,
    mutationUploadImageFile,
    contractWriteSetProfileImage,
    updateProfileImage,
    mutationPollTransaction,
    imageFile,
    setImageFile,
    imageSrc,
    setImageSrc,
  }
}
