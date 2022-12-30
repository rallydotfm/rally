import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import create from 'zustand'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'
import { useRouter } from 'next/router'
import { PublicationMainFocus } from '@graphql/lens/generated'
import { v4 as uuidv4 } from 'uuid'
import { useStoreBundlr } from '@hooks/useBundlr'
import useCreateLensPost from '@hooks/useCreateLensPost'
import useIndexAudioChat from '@hooks/useAddAudioChat.ts'
export interface TxUi {
  isDialogVisible: boolean
  metadataArweaveTxId: string | undefined
  audioFileArweaveTxId: string | undefined
  lensPublicationId: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  setMetadataArweaveTxId: (cid?: string) => void
  setAudioFileArweaveTxId: (txId?: string) => void
  setLensPublicationId: (publicationId?: string) => void
  resetState: () => void
}

export const useStoreTxUi = create<TxUi>((set) => ({
  setDialogVisibility: (visibility: boolean) => set(() => ({ isDialogVisible: visibility })),
  setMetadataArweaveTxId: (tx?: string) => set(() => ({ metadataArweaveTxId: tx })),
  setAudioFileArweaveTxId: (tx?: string) => set(() => ({ audioFileArweaveTxId: tx })),

  setLensPublicationId: (id?: string) => set(() => ({ lensPublicationId: id })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      metadataArweaveTxId: undefined,
      audioFileArweaveTxId: undefined,
      lensPublicationId: undefined,
    })),
  isDialogVisible: false,
  metadataArweaveTxId: undefined,
  audioFileArweaveTxId: undefined,
  lensPublicationId: undefined,
}))

export function useSmartContract(stateTxUi: TxUi) {
  const { publishPost, mutationCreatePostViaDispatcher } = useCreateLensPost()
  const mutationIndexAudioChat = useIndexAudioChat()
  const audioFileArweaveTxId = useStoreTxUi((state) => state?.audioFileArweaveTxId)
  const metadataArweaveTxId = useStoreTxUi((state) => state?.metadataArweaveTxId)
  const setAudioFileArweaveTxId = useStoreTxUi((state: any) => state?.setAudioFileArweaveTxId)
  const setMetadataArweaveTxId = useStoreTxUi((state: any) => state?.setMetadataArweaveTxId)
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const queryClient = useQueryClient()
  const { query } = useRouter()

  // Query to edit an existing audio chat
  const contractWriteUpdateAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'updateAudioChat',
    chainId,
  })

  // Transaction receipt for `recklesslyUnprepared` (edit audio chat data query)
  const txUpdateAudioChat = useWaitForTransaction({
    hash: contractWriteUpdateAudioChat?.data?.hash,
    chainId,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess() {
      toast.success('Your recording was stored and published successfully !')
    },
  })

  /**
   * Create Lens Post
   */
  const mutationPublishToLens = useMutation(async (args: { metadata: any; values: any }) => {
    try {
      const { metadata, values } = args
      const lensPostId = await publishPost(`https://arweave.net/${metadata}`, values)
      return lensPostId
    } catch (e) {
      toast.error("Something went wrong and your post couldn't be published on Lens.")
      console.error(e)
    }
  })
  /**
   * Upload audio file to Bundlr
   */
  const mutationUploadAudioFileToBundlr = useMutation(async (filePath) => {
    try {
      const txn = await bundlr.upload(filePath, [{ name: 'Content-Type', value: 'audio/ogg' }])
      setAudioFileArweaveTxId(txn?.id)
      return txn?.id
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong while uploading your recording file.')
    }
  })

  /**
   * Upload our JSON file to Bundlr
   */
  const mutationUploadMetadataToBundlr = useMutation(async (args: any) => {
    const { data, tags } = args
    try {
      const txn = await bundlr.upload(data, { tags: tags })
      setMetadataArweaveTxId(txn.id)
      return txn.id
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong while uploading your recording metadata.')
    }
  })

  /**
   *  Upload audio file to Bundlr, publish metadata file
   * @param values - values returned by our form
   */
  async function prepareRecordingData(values: any) {
    const previousData: any = queryClient.getQueryData(['audio-chat-metadata', values?.id])

    try {
      let idTxUploadAudioFileToArweave = audioFileArweaveTxId
      let lensPostId = ''
      if (!idTxUploadAudioFileToArweave) {
        idTxUploadAudioFileToArweave = await mutationUploadAudioFileToBundlr.mutateAsync(values.file)
      }

      let metadata = metadataArweaveTxId

      if (!metadataArweaveTxId?.length) {
        // create JSON file with form values + uploaded recording

        const recordingData = {
          version: '2.0.0',
          mainContentFocus: PublicationMainFocus.Audio,
          metadata_id: uuidv4(),
          description: values.recording_description,
          locale: values.recording_language,

          content: values.recording_description,
          external_url: `${process.env.NEXT_PUBLIC_APP_URL}/rally/${values?.id}`,
          image: values?.recording_image_src ?? '',
          imageMimeType: 'image/*',
          name: values.recording_title,
          attributes: [
            {
              traitType: 'type',
              displayType: 'string',
              value: 'audio',
            },
            {
              traiType: 'name',
              displayType: 'string',
              value: values.recording_title,
            },
            {
              traiType: 'title',
              displayType: 'string',
              value: values.recording_title,
            },
            {
              traiType: 'author',
              displayType: 'string',
              value: values.recording_title,
            },
            {
              traiType: 'thumbnail',
              displayType: 'string',
              value: values?.recording_image_src ?? null,
            },
            {
              traiType: 'category',
              displayType: 'string',
              value: previousData?.category,
            },
            {
              traiType: 'rally',
              displayType: 'string',
              value: values?.id,
            },
          ],
          tags: values.recording_tags ?? [],
          contentWarning: values.recording_is_nsfw === true ? 'NSFW' : null,
          media: [
            {
              type: 'audio/ogg',
              item: `https://arweave.net/${idTxUploadAudioFileToArweave}`,
            },
          ],
          appId: 'Rally',
        }

        const recordingDataJSON = JSON.stringify(recordingData)

        const tags = [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'Rally' },
        ]

        //@ts-ignore
        metadata = await mutationUploadMetadataToBundlr.mutateAsync({ data: recordingDataJSON, tags })
        if (values?.publish_on_lens === true) {
          //@ts-ignore
          lensPostId = await mutationPublishToLens.mutateAsync({ metadata, values })
        }
        setMetadataArweaveTxId(metadata)
      }

      return {
        recordingMetadataArweaveTxId: metadata,
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
  async function onSubmitRecording(args: any) {
    contractWriteUpdateAudioChat.reset()
    mutationUploadAudioFileToBundlr.reset()
    mutationUploadMetadataToBundlr.reset()
    mutationPublishToLens.reset()

    const { id, is_indexed, start_at, metadata_cid, values, profileId } = args
    const previousData: any = queryClient.getQueryData(['audio-chat-metadata', id])

    stateTxUi.setDialogVisibility(true)
    try {
      //@ts-ignore
      const { recordingMetadataArweaveTxId, lensPostId } = await prepareRecordingData({ ...values, id, profileId })
      await contractWriteUpdateAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [
          /*
            audio_event_id (bytes32)
            new_cid (string)
            start_at (uint256)
            is_indexed (bool)
            recording_arweave_transaction_id (string)
            lens_publication_id (string) 
          */
          id,
          metadata_cid,
          start_at,
          is_indexed,
          (recordingMetadataArweaveTxId as string) ?? '',
          lensPostId ?? '',
        ],
      })

      await contractWriteUpdateAudioChat.data?.wait()

      if (is_indexed === true) {
        const updatedData = {
          ...previousData,
          recording_arweave_transaction_id: recordingMetadataArweaveTxId,
        }
        await mutationIndexAudioChat.mutateAsync(
          //@ts-ignore
          {
            //@ts-ignore
            audio_event_id: updatedData.id,
            //@ts-ignore
            creator: updatedData.creator,
            //@ts-ignore
            is_indexed: updatedData.is_indexed,
            //@ts-ignore
            start_at: updatedData.epoch_time_start_at,
            //@ts-ignore
            created_at: updatedData.epoch_time_created_at,
            //@ts-ignore
            cid_metadata: updatedData.cid,
            //@ts-ignore
            current_state: updatedData.state,
            //@ts-ignore
            category: updatedData.category,
            //@ts-ignore
            description: updatedData.description,
            //@ts-ignore
            name: updatedData.name,
            //@ts-ignore
            image: updatedData.image,
            //@ts-ignore
            is_gated: updatedData.is_gated,
            //@ts-ignore
            max_attendees: updatedData.max_attendees,
            //@ts-ignore
            language: updatedData.language,
            //@ts-ignore
            recording_arweave_transaction_id: updatedData.recording_arweave_transaction_id,
            //@ts-ignore
            will_be_recorded: updatedData.will_be_recorded,
            //@ts-ignore
            is_nsfw: updatedData.is_nsfw,
            //@ts-ignore
            recording_arweave_transaction_id: updatedData.recording_arweave_transaction_id,
          },
        )
      }

      await queryClient.invalidateQueries({
        queryKey: ['audio-chat-metadata', query?.id_rally],
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onSubmitRecording,
    statePublishRecording: {
      contract: contractWriteUpdateAudioChat,
      transaction: txUpdateAudioChat,
      uploadAudioFile: mutationUploadAudioFileToBundlr,
      uploadMetadata: mutationUploadMetadataToBundlr,
      postToLens: mutationPublishToLens,
      postToLensGasless: mutationCreatePostViaDispatcher,
    },
  }
}

export default useSmartContract
