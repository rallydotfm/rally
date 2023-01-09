import { getUnixTime } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { utils } from 'ethers'
import create from 'zustand'
import toast from 'react-hot-toast'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { chainId } from '@config/wagmi'
import { ipfsClient } from '@config/ipfs'
export interface TxUi {
  isDialogVisible: boolean
  rallyId: string | undefined
  fileRallyCID: string | undefined
  imageRallyCID: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  setRallyId: (newId?: string) => void
  setFileRallyCID: (newFileCid?: string) => void
  setImageRallyCID: (newImageCid?: string) => void
  resetState: () => void
  primedRally: any
  setPrimedRally: (rally: any) => void
}
import useIndexAudioChat from '@hooks/useAddAudioChat.ts'
import { useState } from 'react'
import useUnindexAudioChat from '@hooks/useUnindexAudioChat'
export const useStoreTxUi = create<TxUi>((set) => ({
  setDialogVisibility: (visibility: boolean) => set(() => ({ isDialogVisible: visibility })),
  setRallyId: (newId?: string) => set(() => ({ rallyId: newId })),
  setFileRallyCID: (cid?: string) => set(() => ({ fileRallyCID: cid })),
  setImageRallyCID: (cid?: string) => set(() => ({ imageRallyCID: cid })),
  setPrimedRally: (rally?: any) => set(() => ({ primedRally: rally })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      rallyId: undefined,
      fileRallyCID: undefined,
      imageRallyCID: undefined,
      primedRally: undefined,
    })),
  isDialogVisible: false,
  rallyId: undefined,
  fileRallyCID: undefined,
  imageRallyCID: undefined,
  primedRally: undefined,
}))

export function useSmartContract(stateTxUi: TxUi) {
  const account = useAccount()
  const queryClient = useQueryClient()
  const mutationIndexAudioChat = useIndexAudioChat()
  const mutationUnindexAudioChat = useUnindexAudioChat()
  const [rallyDataToIndex, setRallyDataToIndex] = useState({})
  // Query to create a new audio chat
  const contractWriteNewAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'createNewAudioChat',
    chainId,
  })

  // Transaction receipt for `contractWriteNewAudioChat` (create new audio chat query)
  const txCreateAudioChat = useWaitForTransaction({
    hash: contractWriteNewAudioChat?.data?.hash,
    chainId,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess(data) {
      const iface = new utils.Interface(audioChatABI)
      const log = data.logs
      toast.success('Your rally was created successfully !')
      const { audio_event_id, is_indexed, start_at, created_at, cid_metadata, current_state } = iface.parseLog(
        //@ts-ignore
        log[0],
      ).args

      if (is_indexed === true) {
        await mutationIndexAudioChat.mutateAsync(
          //@ts-ignore
          {
            audio_event_id,
            creator: account?.address,
            start_at,
            created_at,
            cid_metadata,
            current_state,
            ...rallyDataToIndex,
          },
        )
      }

      setRallyDataToIndex({})
      stateTxUi.setRallyId(audio_event_id)
      queryClient.setQueryData(['audio-chat-metadata', stateTxUi.rallyId], {
        id: audio_event_id,
        cid: cid_metadata,
        is_indexed: is_indexed,
        //@ts-ignore
        state: DICTIONARY_STATES_AUDIO_CHATS[current_state],
        creator: account?.address,
        datetime_start_at: new Date(parseInt(`${start_at}`) * 1000),
        datetime_created_at: new Date(parseInt(`${created_at}`) * 1000),
        epoch_time_start_at: parseInt(`${start_at}`) * 1000,
        epoch_time_created_at: parseInt(`${created_at}`) * 1000,
        ...stateTxUi.primedRally,
      })
      stateTxUi.setFileRallyCID()
      stateTxUi.setImageRallyCID()
    },
  })

  // Query to edit an existing audio chat
  const contractWriteEditAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'updateAudioChat',
    chainId,
  })

  // Transaction receipt for `recklesslyUnprepared` (edit audio chat data query)
  const txEditAudioChat = useWaitForTransaction({
    hash: contractWriteEditAudioChat?.data?.hash,
    chainId,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: ['audio-chat-metadata', stateTxUi.rallyId],
        refetchType: 'none',
      })
      const iface = new utils.Interface(audioChatABI)
      const log = data.logs
      //@ts-ignore
      const { is_indexed, start_at, cid_metadata, current_state } = iface.parseLog(log[0]).args
      const previousData = queryClient.getQueryData(['audio-chat-metadata', stateTxUi.rallyId])
      const updatedData = {
        //@ts-ignore
        ...previousData,
        cid: cid_metadata,
        is_indexed: is_indexed,
        //@ts-ignore
        state: DICTIONARY_STATES_AUDIO_CHATS[current_state],
        datetime_start_at: new Date(parseInt(`${start_at}`) * 1000),
        epoch_time_start_at: parseInt(`${start_at}`) * 1000,
        ...stateTxUi.primedRally,
      }

      if (is_indexed === true) {
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
      } else {
        // delete from db if it exists there
        //@ts-ignore
        await mutationUnindexAudioChat.mutateAsync(stateTxUi.rallyId)
      }

      toast.success('Your rally was updated successfully !')
    },
  })

  /**
   * Upload our image file to IPFS (using web3 storage)
   */
  const mutationUploadImageFile = useMutation(async (file: any) => {
    try {
      const result = await ipfsClient.add(file)
      const cid = result.path
      stateTxUi.setImageRallyCID(cid)
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
  const mutationUploadJsonFile = useMutation(async (args: { rallyData: any }) => {
    const { rallyData } = args
    try {
      const result = await ipfsClient.add(JSON.stringify(rallyData))
      const cid = result.path
      stateTxUi.setFileRallyCID(cid)
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
  async function prepareRallyData(values: any, isUpdate: boolean) {
    try {
      let image = stateTxUi.imageRallyCID
      let metadata = stateTxUi.fileRallyCID

      // upload image file (if it exists) to IPFS
      if (values?.rally_image_file) {
        image = await mutationUploadImageFile.mutateAsync(values?.rally_image_file)
        stateTxUi.setImageRallyCID(image)
      }

      if (!stateTxUi.fileRallyCID?.length || isUpdate === true) {
        // create JSON file with form values + uploaded image URL
        let rally_cohosts = []
        let rally_guests = []

        if (values?.rally_cohosts?.length > 0) {
          //@ts-ignore
          rally_cohosts = values.rally_cohosts
        }

        if (values?.rally_guests?.length > 0) {
          //@ts-ignore
          rally_guests = values.rally_guests
        }

        const rallyData = {
          name: values.rally_name ?? '',
          description: values.rally_description ?? '',
          language: values.rally_language ?? 'en',
          tags: values.rally_tags ?? [],
          has_cohosts: rally_cohosts?.length > 0,
          cohosts_list: rally_cohosts,
          guests_list: rally_guests,
          category: values?.rally_category,
          is_nsfw: values?.rally_is_nsfw,
          will_be_recorded: values.rally_is_recorded,
          clips_allowed: values.rally_clips_allowed,
          is_gated: values.rally_is_gated,
          max_attendees: values.rally_max_attendees ?? 100,
          access_control: {
            guilds: values.rally_access_control_guilds,
            whitelist: [account.address, ...values?.rally_cohosts?.map((cohost: any) => cohost.eth_address)],
          },
        }

        if (image && values.rally_image_file) {
          //@ts-ignore
          rallyData.image = image
        } else {
          //@ts-ignore
          if (values.rally_image_src) rallyData.image = values.rally_image_src
        }

        // upload JSON file to IPFS
        stateTxUi.setPrimedRally(rallyData)
        //@ts-ignore
        metadata = await mutationUploadJsonFile.mutateAsync({ rallyData })
        stateTxUi.setFileRallyCID(metadata)
        setRallyDataToIndex(rallyData)
      }

      const startAt = getUnixTime(new Date(values.rally_start_at))
      const creatorWalletAddress = account?.address
      const isIndexed = values.rally_is_indexed

      return {
        startAt,
        metadata,
        creatorWalletAddress,
        isIndexed,
        rallyDataToIndex,
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  }

  /**
   * Upload form data as a JSON after preparing them (upload image, encrypt cohosts wallet address) and create a new audio chat on chain
   */
  async function onSubmitNewAudioChat(values: any) {
    contractWriteNewAudioChat.reset()
    mutationUploadImageFile.reset()
    mutationUploadJsonFile.reset()
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRallyData(values, false)
      //@ts-ignore
      const { startAt, metadata, creatorWalletAddress, isIndexed, rallyData } = args
      await contractWriteNewAudioChat?.writeAsync?.({
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
          startAt,
          //@ts-ignore
          getUnixTime(new Date()),
          metadata,
          creatorWalletAddress,
          isIndexed,
          '',
          '',
        ],
      })
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Upload form data as a JSON after preparing them (upload image, encrypt cohosts wallet address) and update an audio chat data on chain
   */
  async function onSubmitEditAudioChat(args: any) {
    contractWriteEditAudioChat.reset()
    mutationUploadImageFile.reset()
    mutationUploadJsonFile.reset()
    const { id, values, created_at, current_state } = args
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRallyData(values, true)
      //@ts-ignore
      const { startAt, metadata } = args

      await contractWriteEditAudioChat?.writeAsync?.({
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
          metadata,
          startAt,
          values.rally_is_indexed,
          '',
          '',
        ],
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onSubmitNewAudioChat,
    onSubmitEditAudioChat,
    stateEditAudioChat: {
      contract: contractWriteEditAudioChat,
      transaction: txEditAudioChat,
      uploadImage: mutationUploadImageFile,
      uploadData: mutationUploadJsonFile,
    },
    stateNewAudioChat: {
      contract: contractWriteNewAudioChat,
      transaction: txCreateAudioChat,
      uploadImage: mutationUploadImageFile,
      uploadData: mutationUploadJsonFile,
    },
  }
}

export default useSmartContract
