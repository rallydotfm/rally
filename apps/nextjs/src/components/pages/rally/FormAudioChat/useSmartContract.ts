import { useState } from 'react'
import { getUnixTime } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction, useNetwork } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { utils } from 'ethers'

export function useSmartContract() {
  const [fileRallyCID, setFileRallyCID] = useState()
  const [imageRallyCID, setImageRallyCID] = useState()
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
      console.error('Something went wrong :( ', e)
    },
    onSuccess(data) {
      const iface = new utils.Interface(audioChatABI)
      const log = data.logs
      console.log('Created !', iface.parseLog(log[0]))
      console.log('Created !', iface.parseLog(log[1]))
    },
  })

  /**
   * Upload our image file to IPFS (using web3 storage)
   */
  const mutationUploadImageFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      const cid = await client.put([file])
      setImageRallyCID(cid)
      return cid
    } catch (e) {
      console.error(e)
    }
  })

  /**
   * Upload our JSON file to IPFS (using web3 storage)
   */
  const mutationUploadJsonFile = useMutation(async (file) => {
    try {
      const client = makeStorageClient()
      const cid = await client.put([file])
      setFileRallyCID(cid)
      return cid
    } catch (e) {}
  })

  /**
   *  Upload Rally image to IPFS (if necessary) and format and upload Rally data as a JSON file to IPFS (if necessary)
   * @param values - values returned by our form
   */
  async function prepareRallyData(values) {
    try {
      if (!imageRallyCID) {
        await mutationUploadImageFile.mutateAsync(values?.rally_image_file)
      }

      if (!fileRallyCID) {
        // upload image file (if it exists) to IPFS
        // create JSON file with form values + uploaded image URL
        const rallyData = {
          name: values.rally_name,
          description: values.rally_description,
          tags: values.rally_tags,
          image: `${imageRallyCID}/${values.rally_image_file.name}`,
          has_cohosts: values.rally_has_cohosts,
          cohosts_list: values.rally_cohosts ?? [],
          will_be_recorded: values.rally_is_recorded,
          is_private: values.rally_is_private,
          access_control: {
            guilds: values.rally_access_control_guilds,
            blacklist: values.rally_access_control_blacklist,
            whitelist: [...values.rally_access_control_whitelist, ...values.rally_cohosts],
          },
        }
        const rallyDataJSON = new File([JSON.stringify(rallyData)], 'data.json', {
          type: 'application/json',
        })
        // upload JSON file to IPFS
        const cidMetadata = await mutationUploadJsonFile.mutateAsync(rallyDataJSON)

        return [
          /*
            eventTimestamp : Datetime at which the rally will start,
            createdAt: Current datetime,
            cid_metadata: CID
            creator: Current user wallet address
          */
          getUnixTime(new Date(values.rally_start_at)),
          getUnixTime(new Date()),
          cidMetadata,
          account?.address,
        ]
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function onSubmitNewAudioChat(values) {
    try {
      const args = await prepareRallyData(values)
      await contractWriteNewAudioChat?.writeAsync?.({
        recklesslySetUnpreparedArgs: args,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    onSubmitNewAudioChat,
    stateNewAudioChat: {
      transaction: txCreateAudioChat,
      uploadImage: mutationUploadImageFile,
      uploadData: mutationUploadJsonFile,
    },
  }
}

export default useSmartContract
