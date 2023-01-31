import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import create from 'zustand'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'
import { useRouter } from 'next/router'
import { PublicationContentWarning, PublicationMainFocus } from '@graphql/lens/generated'
import { v4 as uuidv4 } from 'uuid'
import { useStoreBundlr } from '@hooks/useBundlr'
import useCreateLensPost from '@hooks/useCreateLensPost'
import useIndexAudioChat from '@hooks/useAddAudioChat.ts'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import jsonToBase64 from '@helpers/jsonToBase64'
import getEncryptionCriteria from '@helpers/getEncryptionCriteria'
import useLit from '@hooks/useLit'
import { EncryptedMetadata, LensEnvironment, LensGatedSDK, MetadataV2 } from '@lens-protocol/sdk-gated'
import { getUnixTime } from 'date-fns'
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
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {})
  const { publishPost, mutationCreatePostViaDispatcher } = useCreateLensPost()
  const { mutationEncryptText, mutationSignMessage } = useLit()
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
    address: CONTRACT_AUDIO_CHATS as `0x${string}`,
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
  const mutationPublishToLens = useMutation(async (args: { arweaveTxId: any; values: any; encrypted?: any }) => {
    try {
      const { arweaveTxId, values, encrypted } = args
      const lensPostId = await publishPost(`https://arweave.net/${arweaveTxId}`, values, encrypted)
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
   *  Upload audio file to Bundlr, encrypt metadata, publish to Lens
   * @param values - values returned by our form
   */
  async function prepareRecordingData(values: any) {
    const previousData: any = queryClient.getQueryData(['audio-chat-metadata', values?.id])
    let encrypted = {}
    let lensPostId = ''

    try {
      let idTxUploadAudioFileToArweave = audioFileArweaveTxId
      if (!idTxUploadAudioFileToArweave) {
        idTxUploadAudioFileToArweave = await mutationUploadAudioFileToBundlr.mutateAsync(values.file)
      }

      let _metadataArweaveTxId = metadataArweaveTxId

      if (!metadataArweaveTxId?.length) {
        // create JSON file with form values + uploaded recording

        const recordingData: MetadataV2 = {
          version: '2.0.0',
          mainContentFocus: PublicationMainFocus.Audio,
          metadata_id: uuidv4(),
          description: values.recording_description,
          locale: values.recording_language,

          content: values.recording_description,
          external_url: `https://arweave.net/${idTxUploadAudioFileToArweave}`,
          image: `ipfs://${values?.recording_image_src}` ?? '',
          imageMimeType: values?.recording_image_src ? 'image/webp' : undefined,
          name: values.recording_title,
          attributes: [
            {
              traitType: 'type',
              value: 'audio',
            },
            {
              traitType: 'epoch_datetime_publication',
              value: `${getUnixTime(new Date())}`,
            },
            {
              traitType: 'name',
              value: values.recording_title,
            },
            {
              traitType: 'title',
              value: values.recording_title,
            },
            {
              traitType: 'author',
              value: account?.address,
            },
            {
              traitType: 'thumbnail',
              value: `ipfs://${values?.recording_image_src}` ?? '',
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
          tags: values.recording_tags ?? [],
          media: [
            {
              type: 'audio/ogg',
              item: `https://arweave.net/${idTxUploadAudioFileToArweave}`,
            },
          ],
          appId: 'Rally',
        }

        if (values.recording_is_nsfw === true) recordingData.contentWarning = PublicationContentWarning.Nsfw

        const recordingDataAsString = JSON.stringify(recordingData)

        const tags =
          values.gated_module === true
            ? [{ name: 'Content-Type', value: 'application/json' }]
            : [
                { name: 'Content-Type', value: 'application/json' },
                { name: 'App-Name', value: 'Rally' },
              ]
        // If the publication is gated
        if (values.gated_module === true && values?.access_control_conditions?.length > 0) {
          // Lens access controls condition are slightly different from Lit
          // So we create 2 different objects that will have the same conditions but with a different syntax

          const { litCriteria, accessControl } = getEncryptionCriteria({
            currentUserEthAddress: account?.address as `0x${string}`,
            accessControlConditions: values.access_control_conditions,
            conditionOperator: values.gated_module_condition_operator,
          })

          if (values?.publish_on_lens === true) {
            const signer = await account?.connector?.getSigner()
            const provider = await account?.connector?.getProvider()
            // upload the metadata + encrypt them

            // upload the metadata + encrypt them
            const sdk = await LensGatedSDK.create({
              provider: provider,
              signer,
              //@ts-ignore
              env: process.env.NEXT_PUBLIC_ENVIRONMENT || LensEnvironment.Mumbai,
            })
            const { error, contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
              //@ts-ignore
              recordingData,
              queryLensProfile?.data?.id,
              accessControl,
              //@ts-ignore
              async (dataToEncrypt: EncryptedMetadata) => {
                _metadataArweaveTxId = await mutationUploadMetadataToBundlr.mutateAsync({
                  data: JSON.stringify(dataToEncrypt),
                  tags,
                })
                setMetadataArweaveTxId(_metadataArweaveTxId)
                return _metadataArweaveTxId
              },
            )

            encrypted = {
              contentURI,
              encryptedMetadata,
              accessControl,
              _metadataArweaveTxId,
              litCriteria,
            }
            //@ts-ignore
            lensPostId = await mutationPublishToLens.mutateAsync({
              arweaveTxId: _metadataArweaveTxId,
              values,
              encrypted,
            })
            if (error) throw new Error(error?.message)
          } else {
            // Otherwise
            // Encrypt the data first
            const litEncryptedMetadata = await mutationEncryptText.mutateAsync({
              //@ts-ignore
              text: recordingDataAsString,
              accessControlConditions: litCriteria,
            })

            // Then upload the encrypted data
            //@ts-ignore
            _metadataArweaveTxId = await mutationUploadMetadataToBundlr.mutateAsync({
              data: JSON.stringify({
                data: litEncryptedMetadata?.encryptedString,
                access_control_conditions: litCriteria,
                encrypted_symmetric_key: litEncryptedMetadata?.encryptedSymmetricKey,
              }),
              tags,
            })

            setMetadataArweaveTxId(_metadataArweaveTxId)

            encrypted = {
              litEncryptedMetadata,
              litCriteria,
            }
          }
        } else {
          _metadataArweaveTxId = await mutationUploadMetadataToBundlr.mutateAsync({
            data: recordingDataAsString,
            tags,
          })

          setMetadataArweaveTxId(_metadataArweaveTxId)

          // If the publication must be shared on lens
          // Create a publication
          if (values?.publish_on_lens === true) {
            //@ts-ignore
            lensPostId = await mutationPublishToLens.mutateAsync({
              arweaveTxId: _metadataArweaveTxId,
              values,
              encrypted,
            })
          }
        }
      }

      const recordingMetadataArweaveTxId =
        values.gated_module === true
          ? jsonToBase64({
              //@ts-ignore
              access_control_conditions: encrypted?.litCriteria,
              //@ts-ignore
              arweave_transaction_id: encrypted?.litEncryptedMetadata?.encryptedString,
              //@ts-ignore
              encrypted_symmetric_key: encrypted?.litEncryptedMetadata?.encryptedSymmetricKey,
            })
          : jsonToBase64({
              access_control_conditions: 'FREE',
              arweave_transaction_id: _metadataArweaveTxId,
              encrypted_symmetric_key: null,
            })

      return {
        recordingMetadataArweaveTxId,
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
    mutationCreatePostViaDispatcher.reset()
    mutationUploadAudioFileToBundlr.reset()
    mutationUploadMetadataToBundlr.reset()
    mutationPublishToLens.reset()
    mutationSignMessage.reset()
    mutationEncryptText.reset()
    mutationIndexAudioChat.reset()

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
      signEncryptMessage: mutationSignMessage,
      contract: contractWriteUpdateAudioChat,
      encrypt: mutationEncryptText,
      transaction: txUpdateAudioChat,
      uploadAudioFile: mutationUploadAudioFileToBundlr,
      uploadMetadata: mutationUploadMetadataToBundlr,
      postToLens: mutationPublishToLens,
      postToLensGasless: mutationCreatePostViaDispatcher,
    },
  }
}

export default useSmartContract
