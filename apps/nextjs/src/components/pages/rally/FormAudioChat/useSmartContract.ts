import { getUnixTime } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { makeStorageClient } from '@config/web3storage'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useContractWrite, useAccount, useWaitForTransaction, useNetwork, chainId, useSignMessage } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { utils } from 'ethers'
import create from 'zustand'
import toast from 'react-hot-toast'
//@ts-ignore
import LitJsSdk from '@lit-protocol/sdk-browser'
import { SiweMessage } from 'siwe'
import { blobToBase64 } from '@helpers/blobToBase64'

// -- init litNodeClient
const litNodeClient = new LitJsSdk.LitNodeClient()
litNodeClient.connect()
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

  const { signMessageAsync, ...mutationSignMessage } = useSignMessage({
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })

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
   * Get Lit access controls conditions for cohosts address encryption
   */
  function getAccessControlsConditionsCohostAddress() {
    const litChain = chain?.id === chainId.polygon ? 'polygon' : 'mumbai'
    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: account.address,
        },
      },
    ]
    return accessControlConditions
  }

  /**
   * Get SIWE message to encrypt data with Lit
   */
  function getPreparedMessageCohostAddress() {
    const message = new SiweMessage({
      domain: window.location.host,
      address: account?.address,
      statement: 'Create signature to encrypt/decrypt co-hosts Ethereum address',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
    })
    const preparedMessage = message.prepareMessage()
    return preparedMessage
  }

  /**
   * Encrypt a cohost ethereum address with Lit so that only the audio chat creator can access them
   */
  async function encryptCohostEthAddress(config: { accessControlConditions: any; authSig: any; cohost: any }) {
    const { accessControlConditions, authSig, cohost } = config
    try {
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(cohost.eth_address)
      const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain: accessControlConditions?.[0]?.chain,
      })
      const encryptedStringAsText = await blobToBase64(encryptedString)
      return {
        name: cohost?.name,
        encrypted_address: encryptedStringAsText,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Encrypt all cohosts address
   */
  async function encryptListCohosts(cohosts: Array<{ name: string; eth_address: string }>) {
    try {
      const accessControlConditions = getAccessControlsConditionsCohostAddress()
      const preparedMessage = getPreparedMessageCohostAddress()
      const signature = await signMessageAsync({
        message: preparedMessage,
      })
      const authSig = {
        sig: signature,
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: preparedMessage,
        address: account.address,
      }
      const encryptedList = await Promise.all(
        cohosts.map(async (cohost: any) => {
          const encryptedCohost = await encryptCohostEthAddress({
            accessControlConditions,
            authSig,
            cohost,
          })
          return encryptedCohost
        }),
      )
      return encryptedList
    } catch (e) {
      console.error(e)
    }
  }
  /**
   *  Upload Rally image to IPFS (if necessary) and format and upload Rally data as a JSON file to IPFS (if necessary)
   * @param values - values returned by our form
   */
  async function prepareRallyData(values: any) {
    try {
      let image = stateTxUi.imageRallyCID
      let metadata = stateTxUi.fileRallyCID

      // upload image file (if it exists) to IPFS
      if (values?.rally_image_file) {
        image = await mutationUploadImageFile.mutateAsync(values?.rally_image_file)
        stateTxUi.setImageRallyCID(image)
      }

      if (!stateTxUi.fileRallyCID?.length) {
        // create JSON file with form values + uploaded image URL
        let rally_cohosts = []

        // encrypt cohosts addresses
        if (values?.rally_cohosts?.length > 0) {
          //@ts-ignore
          rally_cohosts = await encryptListCohosts(values.rally_cohosts)
        }

        const rallyData = {
          name: values.rally_name,
          description: values.rally_description,
          tags: values.rally_tags,
          has_cohosts: values.rally_has_cohosts,
          cohosts_list: rally_cohosts,
          will_be_recorded: values.rally_is_recorded,
          is_gated: values.rally_is_gated,
          max_attendees: values.rally_max_attendees,
          access_control: {
            guilds: values.rally_access_control_guilds,
            whitelist: [account.address, ...values.rally_cohosts.map((cohost: any) => cohost.eth_address)],
          },
        }

        if (image && values?.rally_image_file.name) {
          //@ts-ignore
          rallyData.image = `${image}/${values?.rally_image_file.name}`
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
          Datetime at which the rally will start,
          Current datetime,
          CID,
          Current user wallet address
        */
        getUnixTime(new Date(values.rally_start_at)),
        getUnixTime(new Date()),
        metadata,
        account?.address,
        values.is_indexed,
      ]
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
      signEncryption: mutationSignMessage,
      transaction: txCreateAudioChat,
      uploadImage: mutationUploadImageFile,
      uploadData: mutationUploadJsonFile,
    },
  }
}

export default useSmartContract
