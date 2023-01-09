import { LensEnvironment, LensGatedSDK } from '@lens-protocol/sdk-gated'
import { useMutation } from '@tanstack/react-query'
import create from 'zustand'
import { providers } from 'ethers'
import toast from 'react-hot-toast'

export const useStoreDecryptPublication = create((set) => ({
  sdk: undefined,
  initialize: async () => {
    try {
      //@ts-ignore
      await window?.ethereum?.enable()
      const provider = new providers.Web3Provider(window?.ethereum)
      await provider._ready()
      const sdk = await LensGatedSDK.create({
        provider,
        signer: provider.getSigner(),
        env: (process.env.NEXT_PUBLIC_ENVIRONMENT as string) || (LensEnvironment.Mumbai as string),
      })

      return set(() => ({
        sdk,
      }))
    } catch (e) {
      return set(() => ({
        sdk: undefined,
      }))
    }
  },
  resetState: () =>
    set(() => ({
      sdk: undefined,
    })),
}))

export function useGetDecryptedLensPublication() {
  const sdk = useStoreDecryptPublication((state: any) => state?.sdk)
  const initialize = useStoreDecryptPublication((state: any) => state?.initialize)

  const mutationDecryptPublication = useMutation(async (metadata) => {
    try {
      const content = await sdk.gated.decryptMetadata(metadata)
      return content
    } catch (e) {
      console.error('Something went wrong while decrypting publication: ', e)
      toast.error("Something went wrong and the publication couldn't be decrypted.")
    }
  })
  const mutationInitializeDecryptor = useMutation(async () => {
    try {
      await initialize()
    } catch (e) {
      console.error('Something went wrong while initializing the decryptor: ', e)
      toast.error('Something went wrong, try activating the decryptor again.')
    }
  })
  return {
    mutationInitializeDecryptor,
    mutationDecryptPublication,
  }
}

export default useGetDecryptedLensPublication
