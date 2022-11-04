import useGetAudioChatById from '@hooks/useGetAudioChatById'
import { chainId, useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
// @ts-ignore
import LitJsSdk from '@lit-protocol/sdk-browser'

const litNodeClient = new LitJsSdk.LitNodeClient()
litNodeClient.connect()

export function useGetAudioChatToUpdate(id: `0x${string}`) {
  const account = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync, ...mutationSignMessage } = useSignMessage({
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })

  const { queryAudioChatByIdRawData, queryAudioChatMetadata } = useGetAudioChatById(id)
  const queryDecryptCohostsAddress = useQuery(
    ['decrypt-audiochat-cohost-address', queryAudioChatMetadata?.data?.cid],
    async () => {
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
      const message = new SiweMessage({
        domain: window.location.host,
        address: account?.address,
        statement: 'Create signature to encrypt/decrypt co-hosts Ethereum address',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
      })
      const preparedMessage = message.prepareMessage()
      try {
        const signature = await signMessageAsync({
          message: preparedMessage,
        })
        const authSig = {
          sig: signature,
          derivedVia: 'web3.eth.personal.sign',
          signedMessage: preparedMessage,
          address: account.address,
        }

        const decryptedList = await Promise.all(
          queryAudioChatMetadata?.data.cohosts_list.map(async (cohost: any) => {
            const symmetricKey = await litNodeClient.getEncryptionKey({
              accessControlConditions,
              toDecrypt: cohost.encryptedSymmetricKey,
              chain: accessControlConditions?.[0]?.chain,
              authSig,
            })

            const base64Response = await fetch(`${cohost.encrypted_address}`)
            const blob = await base64Response.blob()
            const decrypted = await LitJsSdk.decryptString(blob, symmetricKey)

            return {
              eth_address: decrypted,
              name: cohost.name,
            }
          }),
        )
        return decryptedList
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled:
        queryAudioChatMetadata?.data?.cohosts_list?.length > 0 &&
        queryAudioChatMetadata?.data?.creator === account?.address &&
        chain?.unsupported === false,
    },
  )

  return {
    mutationSignMessage,
    queryDecryptCohostsAddress,
    queryAudioChatByIdRawData,
    queryAudioChatMetadata,
  }
}

export default useGetAudioChatToUpdate
