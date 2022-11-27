import { useQuery } from '@tanstack/react-query'
import { getDefaultProfile } from '@services/lens/profile/getDefaultProfile'

export function useWalletAddressDefaultLensProfile(address: string, enabled?: boolean) {
  const queryLensProfile = useQuery(
    ['lens-profile-by-wallet-address', address],
    async () => {
      try {
        const result = await getDefaultProfile({
          ethereumAddress: address,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.data?.defaultProfile
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: enabled ? enabled : true,
    },
  )

  return queryLensProfile
}

export default useWalletAddressDefaultLensProfile
