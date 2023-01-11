import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { PublicationContentWarning, PublicationMainFocus } from '@graphql/lens/generated'
import { v4 as uuidv4 } from 'uuid'
import useCreateLensPost from '@hooks/useCreateLensPost'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import getEncryptionCriteria from '@helpers/getEncryptionCriteria'
import { EncryptedMetadata, LensEnvironment, LensGatedSDK, MetadataV2 } from '@lens-protocol/sdk-gated'
import { getUnixTime } from 'date-fns'
import { ipfsClient } from '@config/ipfs'
import { useStoreBundlr } from '@hooks/useBundlr'
import create from 'zustand'

export interface TxUi {
  isDialogVisible: boolean
  metadataCid: string | undefined
  videoFileArweaveTxId: string | undefined
  lensPublicationId: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  setMetadataCid: (cid?: string) => void
  setVideoFileArweaveTxId: (txId?: string) => void
  setLensPublicationId: (publicationId?: string) => void
  resetState: () => void
}

export const useStoreTxUi = create<TxUi>((set) => ({
  setDialogVisibility: (visibility: boolean) => set(() => ({ isDialogVisible: visibility })),
  setMetadataCid: (tx?: string) => set(() => ({ metadataCid: tx })),
  setVideoFileArweaveTxId: (tx?: string) => set(() => ({ videoFileArweaveTxId: tx })),

  setLensPublicationId: (id?: string) => set(() => ({ lensPublicationId: id })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      metadataCid: undefined,
      videoFileArweaveTxId: undefined,
      lensPublicationId: undefined,
    })),
  isDialogVisible: false,
  metadataCid: undefined,
  videoFileArweaveTxId: undefined,
  lensPublicationId: undefined,
}))

export function usePublish(stateTxUi: TxUi) {
  const account = useAccount()
  const bundlr = useStoreBundlr((state: any) => state.bundlr)

  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {})
  const { publishPost, mutationCreatePostViaDispatcher } = useCreateLensPost()
  const queryClient = useQueryClient()
  const setVideoFileArweaveTxId = useStoreTxUi((state: any) => state?.setVideoFileArweaveTxId)
  const setMetadataCid = useStoreTxUi((state: any) => state.setMetadataCid)
  const setLensPublicationId = useStoreTxUi((state: any) => state.setLensPublicationId)
  /**
   * Create Lens Post
   */
  const mutationPublishToLens = useMutation(async (args: { contentURI: any; values: any; encrypted?: any }) => {
    try {
      const { contentURI, values, encrypted } = args
      const lensPostId = await publishPost(contentURI, values, encrypted)
      return lensPostId
    } catch (e) {
      toast.error("Something went wrong and your spark couldn't be published on Lens.")
      console.error(e)
    }
  })

  /**
   * Upload audio file to Bundlr
   */
  const mutationUploadVideoFileToBundlr = useMutation(async (filePath) => {
    try {
      const txn = await bundlr.upload(filePath, [{ name: 'Content-Type', value: 'video/mp4' }])
      setVideoFileArweaveTxId(txn?.id)

      return txn?.id
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong while uploading your spark.')
    }
  })

  /**
   * Upload our JSON file to Bundlr
   */
  const mutationUploadMetadata = useMutation(async (args: any) => {
    const { data } = args
    try {
      const result = await ipfsClient.add(JSON.stringify(data))
      const { path } = result
      return path
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong while uploading your spark metadata.')
    }
  })

  /**
   *  Upload audio file to Bundlr, encrypt metadata, publish to Lens
   * @param values - values returned by our form
   */
  async function prepareRecordingData(values: any) {
    const previousData: any = queryClient.getQueryData(['audio-chat-metadata', values?.id])
    let encrypted = {}
    let lensPostId = ''
    let lensPostCid
    try {
      const arweaveTxId = await mutationUploadVideoFileToBundlr.mutateAsync(values.file)

      const sparkData: MetadataV2 = {
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.Video,
        metadata_id: uuidv4(),
        description: values.spark_description,
        locale: values.spark_language,
        content: values.spark_description,
        external_url: null,
        image: `ipfs://${values?.spark_image_src}` ?? '',
        imageMimeType: values?.spark_image_src ? 'image/webp' : undefined,
        name: values.spark_title,
        attributes: [
          {
            traitType: 'type',
            value: 'video',
          },
          {
            traitType: 'epoch_datetime_publication',
            value: `${getUnixTime(new Date())}`,
          },
          {
            traitType: 'name',
            value: values.spark_title,
          },
          {
            traitType: 'title',
            value: values.spark_title,
          },
          {
            traitType: 'author',
            value: account?.address,
          },
          {
            traitType: 'thumbnail',
            value: `ipfs://${values?.spark_image_src}` ?? '',
          },
          {
            traitType: 'category',
            value: previousData?.category,
          },
          {
            traitType: 'rally',
            value: values?.id,
          },
          {
            traitType: 'resolver',
            value: 'rally://',
          },
        ],
        tags: values.spark_tags ?? [],
        media: [
          {
            type: 'video/mp4',
            item: `https://arweave.net/${arweaveTxId}`,
          },
        ],
        appId: 'Rally',
      }

      if (values.spark_is_nsfw === true) sparkData.contentWarning = PublicationContentWarning.Nsfw

      // If the publication is gated
      if (values.gated_module === true && values?.access_control_conditions?.length > 0) {
        const { accessControl } = getEncryptionCriteria({
          currentUserEthAddress: account?.address as `0x${string}`,
          accessControlConditions: values.access_control_conditions,
          conditionOperator: values.gated_module_condition_operator,
        })
        const signer = await account?.connector?.getSigner()
        const provider = await account?.connector?.getProvider()
        const sdk = await LensGatedSDK.create({
          provider: provider,
          signer,
          //@ts-ignore
          env: process.env.NEXT_PUBLIC_ENVIRONMENT || LensEnvironment.Mumbai,
        })
        const { error, contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
          //@ts-ignore
          sparkData,
          queryLensProfile?.data?.id,
          accessControl,
          //@ts-ignore
          async (dataToEncrypt: EncryptedMetadata) => {
            const metadata_cid = await mutationUploadMetadata.mutateAsync({
              data: dataToEncrypt,
            })
            setMetadataCid(metadata_cid)
            return metadata_cid
          },
        )

        encrypted = {
          contentURI,
          encryptedMetadata,
          accessControl,
        }
        //@ts-ignore
        lensPostId = await mutationPublishToLens.mutateAsync({
          contentURI,
          values,
          encrypted,
        })
        if (error) throw new Error(error?.message)
      } else {
        lensPostCid = await mutationUploadMetadata.mutateAsync({
          data: sparkData,
        })
        //@ts-ignore
        lensPostId = await mutationPublishToLens.mutateAsync({
          contentURI: `ipfs://${lensPostCid}`,
          values,
          encrypted,
        })
      }
      return {
        lensPostId,
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  }

  /**
   * Upload form data as a JSON after preparing them (upload image, encrypt cohosts wallet address) and update an audio chat data on chain
   */
  async function onSubmitSpark(args: any) {
    mutationCreatePostViaDispatcher.reset()
    mutationUploadMetadata.reset()
    mutationPublishToLens.reset()

    const { id, values, profileId } = args
    stateTxUi.setDialogVisibility(true)

    try {
      //@ts-ignore
      const { lensPostId } = await prepareRecordingData({ ...values, id, profileId })
      setLensPublicationId(lensPostId)
      return { lensPostId }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onSubmitSpark,
    statePublishSpark: {
      uploadVideo: mutationUploadVideoFileToBundlr,
      uploadMetadata: mutationUploadMetadata,
      postToLens: mutationPublishToLens,
      postToLensGasless: mutationCreatePostViaDispatcher,
    },
  }
}

export default usePublish
