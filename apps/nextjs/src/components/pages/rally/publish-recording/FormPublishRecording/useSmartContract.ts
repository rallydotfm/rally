import { getUnixTime } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import create from 'zustand'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'
import { useRouter } from 'next/router'
import { PublicationMainFocus } from '@graphql/lens/generated'

import { v4 as uuidv4 } from 'uuid'
export interface TxUi {
  isDialogVisible: boolean
  arweaveTxId: string | undefined
  lensPublicationId: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  setArweaveTxId: (newFileCid?: string) => void
  setLensPublicationId: (newImageCid?: string) => void
  resetState: () => void
}

export const useStoreTxUi = create<TxUi>((set) => ({
  setDialogVisibility: (visibility: boolean) => set(() => ({ isDialogVisible: visibility })),
  setArweaveTxId: (cid?: string) => set(() => ({ arweaveTxId: cid })),
  setLensPublicationId: (cid?: string) => set(() => ({ lensPublicationId: cid })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      arweaveTxId: undefined,
      lensPublicationId: undefined,
    })),
  isDialogVisible: false,
  arweaveTxId: undefined,
  lensPublicationId: undefined,
}))

export function useSmartContract(stateTxUi: TxUi) {
  const account = useAccount()
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
   * Upload our recording file to Bundlr
   */
  const mutationPublishToLens = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
      stateTxUi.setLensPublicationId(cid)
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })

  /**
   * Upload our recording file to Bundlr
   */
  const mutationUploadAudioFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
      stateTxUi.setLensPublicationId(cid)
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })

  /**
   * Upload our JSON file to IPFS (using web3 storage)
   */
  const mutationUploadJsonFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
      stateTxUi.setArweaveTxId(cid)
      return cid
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  })

  /**
   *  Upload Rally image to IPFS (if necessary) and format and upload Rally data as a JSON file to IPFS (if necessary)
   * @param values - values returned by our form
   */
  async function prepareRecordingData(values: any, isUpdate: boolean) {
    try {
      let image = stateTxUi.lensPublicationId
      let metadata = stateTxUi.arweaveTxId

      // upload image file (if it exists) to IPFS
      if (values?.rally_image_file) {
        image = await mutationUploadAudioFile.mutateAsync(values?.rally_image_file)
        stateTxUi.setLensPublicationId(image)
      }

      if (!stateTxUi.arweaveTxId?.length || isUpdate === true) {
        // create JSON file with form values + uploaded recording

        const recordingData = {
          version: '2.0.0',
          mainContentFocus: PublicationMainFocus.Audio,
          metadata_id: uuidv4(),
          description: values.recording_description,
          locale: values.recording_language,
          content: values.recording_description,
          external_url: `${process.env.NEXT_PUBLIC_APP_URL}/rally/${query?.id_rally}`,
          image: values.recording_image_src,
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
              item: 'https://arweave.net/',
            },
          ],
          appId: 'Rally',
        }

        if (image && values.rally_image_file) {
          //@ts-ignore
          recordingData.image = `${image}/${values?.rally_image_file.name}`
        } else {
          //@ts-ignore
          if (values.rally_image_src) recordingData.image = values.rally_image_src
        }

        const recordingDataJSON = new File([JSON.stringify(recordingData)], 'data.json', {
          type: 'application/json',
        })

        //@ts-ignore
        metadata = await mutationUploadJsonFile.mutateAsync(recordingDataJSON)
        stateTxUi.setArweaveTxId(metadata)
      }

      const creatorWalletAddress = account?.address
      const isIndexed = values.rally_is_indexed

      return {
        startAt: values.rally_start_at,
        metadata,
        creatorWalletAddress,
        isIndexed,
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
    mutationUploadAudioFile.reset()
    mutationUploadJsonFile.reset()
    mutationPublishToLens.reset()

    const { id, is_indexed, start_at, cid, values } = args
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRecordingData(values, true)
      //@ts-ignore

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
          cid,
          start_at,
          is_indexed,
          args?.arweaveTxId ?? '',
          args?.lensPublicationId ?? '',
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
      uploadAudioFile: mutationUploadAudioFile,
      uploadData: mutationUploadJsonFile,
      publishToLens: mutationPublishToLens,
    },
  }
}

export default useSmartContract
