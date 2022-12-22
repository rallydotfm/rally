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
import { pollUntilIndexed } from '@services/lens/indexer/pollUntilIndexed'
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
  const { publishPost, mutationPollTransaction, contractWriteFollow, signTypedDataFollow } = useCreateLensPost()
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
    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: ['audio-chat-metadata', query?.id_rally],
        refetchType: 'none',
      })
      toast.success('Your recording was stored and published successfully !')
    },
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
      const txn = await bundlr.createTransaction(data, { tags: tags })
      await txn.sign()
      setMetadataArweaveTxId(txn.id)
      await txn.upload()
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
    console.log(values)
    try {
      let idTxUploadAudioFileToArweave = audioFileArweaveTxId
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

        const tags = [{ name: 'Content-Type', value: 'application/json' }]

        //@ts-ignore
        metadata = await mutationUploadMetadataToBundlr.mutateAsync({ data: recordingDataJSON, tags })
        let lensPostId = ''
        if (values?.recording_publish_on_lens === true) {
          const tx = await publishPost(`https://arweave.net/${metadata}`, values)
          console.log(tx)
          const polled = await pollUntilIndexed(tx as `0x${string}`)
          console.log(polled)
        }

        setMetadataArweaveTxId(metadata)
      }

      return metadata
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
    // mutationPublishToLens.reset()

    const { id, is_indexed, start_at, metadata_cid, values, profileId } = args
    stateTxUi.setDialogVisibility(true)
    try {
      const recording_metadata = await prepareRecordingData({ ...values, id, profileId })
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
          recording_metadata as string,
          '',
        ],
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
    },
  }
}

export default useSmartContract
