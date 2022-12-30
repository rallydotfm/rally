import { useForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import { boolean, object, string } from 'zod'
import { useAccount } from 'wagmi'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useStorePersistedPreferences } from '@hooks/usePersistedPreferences'
import toast from 'react-hot-toast'

export const schema = object({
  useLensProfile: boolean(),
  displayName: string().trim().min(1),
  avatarUrl: string().url().optional(),
})
export function useConfigureJoinRoomAs() {
  const configureIdentityInLocalStorage = useStorePersistedPreferences((state: any) => state.configureIdentity)
  const persistedPreferences = useStorePersistedPreferences((state: any) => state.preferences)
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })

  const storeForm = useForm({
    extend: validator({ schema }),
    initialValues: {
      useLensProfile: persistedPreferences?.[account?.address as `0x${string}`]?.identity?.useLensProfile ?? false,
      displayName:
        persistedPreferences?.[account?.address as `0x${string}`]?.identity?.displayName ??
        shortenEthereumAddress(account?.address as `0x${string}`),
      avatarUrl:
        persistedPreferences?.[account?.address as `0x${string}`]?.identity?.avatarUrl ??
        `https://avatars.dicebear.com/api/identicon/${account?.address}.svg`,
    },
    onSubmit: (values) => {
      configureIdentityInLocalStorage(account?.address, {
        useLensProfile: values.useLensProfile,
        displayName: values.displayName,
        avatarUrl: values.avatarUrl,
      })
      toast.success('Your default room profile was saved successfully!')
    },
  })

  return {
    storeForm,
    queryLensProfile,
  }
}

export default useConfigureJoinRoomAs
