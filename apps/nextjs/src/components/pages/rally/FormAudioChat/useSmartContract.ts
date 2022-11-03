import { getUnixTime } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction, useNetwork } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { utils } from 'ethers'
import create from 'zustand'
import toast from 'react-hot-toast'

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
}
export const useStoreTxUi = create<TxUi>((set) => ({
  setDialogVisibility: (visibility: boolean) => set(() => ({ isDialogVisible: visibility })),
  setRallyId: (newId?: string) => set(() => ({ rallyId: newId })),
  setFileRallyCID: (cid?: string) => set(() => ({ fileRallyCID: cid })),
  setImageRallyCID: (cid?: string) => set(() => ({ imageRallyCID: cid })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      rallyId: undefined,
      fileRallyCID: undefined,
      imageRallyCID: undefined,
    })),
  isDialogVisible: false,
  rallyId: undefined,
  fileRallyCID: undefined,
  imageRallyCID: undefined,
}))

export function useSmartContract(stateTxUi: TxUi) {
  const account = useAccount()
  const { chain } = useNetwork()

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
    onSuccess(data) {
      const iface = new utils.Interface(audioChatABI)
      const log = data.logs
      toast.success('Your rally was created successfully !')
      //@ts-ignore
      stateTxUi.setRallyId(iface.parseLog(log[0]).args.audio_event_id)
      stateTxUi.setFileRallyCID()
      stateTxUi.setImageRallyCID()
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
  async function prepareRallyData(values: any) {
    try {
      let image = stateTxUi.imageRallyCID
      let metadata = stateTxUi.fileRallyCID

      if (!stateTxUi.imageRallyCID?.length) {
        image = await mutationUploadImageFile.mutateAsync(values?.rally_image_file)
        stateTxUi.setImageRallyCID(image)
      }
      if (!stateTxUi.fileRallyCID?.length) {
        // upload image file (if it exists) to IPFS
        // create JSON file with form values + uploaded image URL
        const rallyData = {
          name: values.rally_name,
          description: values.rally_description,
          tags: values.rally_tags,
          image: `${image}/${values.rally_image_file.name}`,
          has_cohosts: values.rally_has_cohosts,
          cohosts_list: values.rally_cohosts.map((cohost: any) => cohost.eth_address) ?? [],
          will_be_recorded: values.rally_is_recorded,
          is_private: values.rally_is_private,
          max_attendees: values.rally_max_attendees,
          access_control: {
            guilds: values.rally_access_control_guilds,
            whitelist: [
              ...values.rally_access_control_whitelist,
              ...values.rally_cohosts.map((cohost: any) => cohost.eth_address),
            ],
          },
        }
        const rallyDataJSON = new File([JSON.stringify(rallyData)], 'data.json', {
          type: 'application/json',
        })
        // upload JSON file to IPFS
        //@ts-ignore
        metadata = await mutationUploadJsonFile.mutateAsync(rallyDataJSON)
        stateTxUi.setFileRallyCID(metadata)
      }

      return [
        /*
          eventTimestamp : Datetime at which the rally will start,
          createdAt: Current datetime,
          cid_metadata: CID
          creator: Current user wallet address
        */
        getUnixTime(new Date(values.rally_start_at)),
        getUnixTime(new Date()),
        metadata,
        account?.address,
      ]
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message ?? e)
    }
  }

  async function onSubmitNewAudioChat(values: any) {
    stateTxUi.setDialogVisibility(true)
    try {
      const args = await prepareRallyData(values)
      await contractWriteNewAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: args,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onSubmitNewAudioChat,
    stateNewAudioChat: {
      contract: contractWriteNewAudioChat,
      transaction: txCreateAudioChat,
      uploadImage: mutationUploadImageFile,
      uploadData: mutationUploadJsonFile,
    },
  }
}

export default useSmartContract
