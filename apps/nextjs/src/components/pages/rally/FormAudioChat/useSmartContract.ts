import { getUnixTime } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction, useNetwork } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { utils } from 'ethers'
import create from 'zustand'
import toast from 'react-hot-toast'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
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
  const { chain } = useNetwork()
  const queryClient = useQueryClient()

  // Query to create a new audio chat
  const contractWriteNewAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'createNewAudioChat',
    chainId: chain?.id,
  })

  // Transaction receipt for `contractWriteNewAudioChat` (create new audio chat query)
  const txCreateAudioChat = useWaitForTransaction({
    hash: contractWriteNewAudioChat?.data?.hash,
    chainId: chain?.id,
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
    chainId: chain?.id,
  })

  // Transaction receipt for `recklesslyUnprepared` (edit audio chat data query)
  const txEditAudioChat = useWaitForTransaction({
    hash: contractWriteEditAudioChat?.data?.hash,
    chainId: chain?.id,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ['audio-chat-metadata', stateTxUi.rallyId],
        refetchType: 'none',
      })
      const iface = new utils.Interface(audioChatABI)
      const log = data.logs
      //@ts-ignore
      const { is_indexed, start_at, cid_metadata, current_state } = iface.parseLog(log[0]).args
      queryClient.setQueryData(['audio-chat-metadata', stateTxUi.rallyId], (prev) => ({
        //@ts-ignore
        ...prev,
        cid: cid_metadata,
        is_indexed: is_indexed,
        //@ts-ignore
        state: DICTIONARY_STATES_AUDIO_CHATS[current_state],
        datetime_start_at: new Date(parseInt(`${start_at}`) * 1000),
        epoch_time_start_at: parseInt(`${start_at}`) * 1000,
        ...stateTxUi.primedRally,
      }))

      toast.success('Your rally was updated successfully !')
    },
  })

  /**
   * Upload our image file to IPFS (using web3 storage)
   */
  const mutationUploadImageFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
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
  const mutationUploadJsonFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      //@ts-ignore
      const cid = await client.put([file])
      //@ts-ignore
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
        let whitelist

        if (values?.rally_cohosts?.length > 0) {
          //@ts-ignore
          rally_cohosts = values.rally_cohosts
        }

        if (values?.rally_guests?.length > 0) {
          //@ts-ignore
          rally_guests = values.rally_guests
        }

        const rallyData = {
          name: values.rally_name,
          description: values.rally_description,
          tags: values.rally_tags,
          has_cohosts: rally_cohosts?.length > 0,
          cohosts_list: rally_cohosts,
          guests_list: rally_guests,
          will_be_recorded: values.rally_is_recorded,
          is_gated: values.rally_is_gated,
          max_attendees: values.rally_max_attendees,
          access_control: {
            guilds: values.rally_access_control_guilds,
            whitelist: [account.address, ...values?.rally_cohosts?.map((cohost: any) => cohost.eth_address)],
          },
        }

        if (image && values.rally_image_file) {
          //@ts-ignore
          rallyData.image = `${image}/${values?.rally_image_file.name}`
        } else {
          //@ts-ignore
          if (values.rally_image_src) rallyData.image = values.rally_image_src
        }

        const rallyDataJSON = new File([JSON.stringify(rallyData)], 'data.json', {
          type: 'application/json',
        })

        // upload JSON file to IPFS
        stateTxUi.setPrimedRally(rallyData)
        //@ts-ignore
        metadata = await mutationUploadJsonFile.mutateAsync(rallyDataJSON)
        stateTxUi.setFileRallyCID(metadata)
      }

      const startAt = getUnixTime(new Date(values.rally_start_at))
      const creatorWalletAddress = account?.address
      const isIndexed = values.rally_is_indexed

      return {
        startAt,
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
   * Upload form data as a JSON after preparing them (upload image, encrypt cohosts wallet address) and create a new audio chat on chain
   */
  async function onSubmitNewAudioChat(values: any) {
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRallyData(values, false)
      //@ts-ignore
      const { startAt, metadata, creatorWalletAddress, isIndexed } = args
      await contractWriteNewAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [
          /*
              Datetime at which the rally will start,
              Current datetime,
              CID,
              Current user wallet address,
              should the audiochat be indexed or not
            */
          startAt,
          //@ts-ignore
          getUnixTime(new Date()),
          metadata,
          creatorWalletAddress,
          isIndexed,
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
    const { id, values } = args
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRallyData(values, true)
      //@ts-ignore
      const { startAt, metadata } = args

      await contractWriteEditAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [
          /*
            audio chat id, 
            new CID
            new start_at
            is indexed
          */
          id,
          metadata,
          startAt,
          values.rally_is_indexed,
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
