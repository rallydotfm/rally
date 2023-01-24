import create from 'zustand'
//@ts-ignore
import LitJsSdk from '@lit-protocol/sdk-browser'
import { useMutation } from '@tanstack/react-query'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import toast from 'react-hot-toast'
import { blobToBase64 } from '@helpers/blobToBase64'

const litNodeClient = new LitJsSdk.LitNodeClient()

export const useStoreLit = create((set) => ({
  initialize: async () => {
    await litNodeClient.connect()
  },
}))

const chain = process.env.NEXT_PUBLIC_CHAIN

export function useLit() {
  const account = useAccount()
  const { chain: networkChain } = useNetwork()
  const { signMessageAsync, ...mutationSignMessage } = useSignMessage({
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })
  const initialize = useStoreLit((state: any) => state.initialize)

  const mutationEncryptText = useMutation(async (args: { text: string; accessControlConditions: Array<any> }) => {
    try {
      const { text, accessControlConditions } = args
      if (!litNodeClient?.ready) {
        await initialize()
      }
      const message = new SiweMessage({
        domain: window.location.host,
        address: account?.address,
        statement: 'Sign this message to encrypt/decrypt data with Lit Protocol.',
        uri: window.location.origin,
        version: '1',
        chainId: networkChain?.id ?? chain === 'mumbai' ? 80001 : 137,
      })
      const preparedMessage = message.prepareMessage()
      const signature = await signMessageAsync({
        message: preparedMessage,
      })
      const authSig = {
        sig: signature,
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: preparedMessage,
        address: account.address,
      }
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text)
      const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
        accessControlConditions: accessControlConditions,
        symmetricKey,
        authSig,
        chain,
      })

      const encryptedStringAsText = await blobToBase64(encryptedString)

      return {
        encryptedString: encryptedStringAsText,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(e?.message)
    }
  })

  const mutationDecryptText = useMutation(
    async (args: { encryptedText: string; encryptedSymmetricKey: string; accessControlConditions: Array<any> }) => {
      try {
        const { encryptedText, encryptedSymmetricKey, accessControlConditions } = args
        if (!litNodeClient?.ready) {
          await initialize()
        }
        const message = new SiweMessage({
          domain: window.location.host,
          address: account?.address,
          statement: 'Sign this message to encrypt/decrypt data with Lit Protocol.',
          uri: window.location.origin,
          version: '1',
          chainId: networkChain?.id ?? chain === 'mumbai' ? 80001 : 137,
        })
        const preparedMessage = message.prepareMessage()
        const signature = await signMessageAsync({
          message: preparedMessage,
        })
        const authSig = {
          sig: signature,
          derivedVia: 'web3.eth.personal.sign',
          signedMessage: preparedMessage,
          address: account.address,
        }

        const symmetricKey = await litNodeClient.getEncryptionKey({
          accessControlConditions,
          toDecrypt: encryptedSymmetricKey,
          chain,
          authSig,
        })

        const base64Response = await fetch(`${encryptedText}`)
        const blob = await base64Response.blob()
        const decrypted = await LitJsSdk.decryptString(blob, symmetricKey)
        return { decryptedString: decrypted }
      } catch (e) {
        //@ts-ignore
        toast.error(e?.message)
        console.error(e)
      }
    },
  )

  return {
    mutationEncryptText,
    mutationDecryptText,
    mutationSignMessage,
  }
}

export default useLit
