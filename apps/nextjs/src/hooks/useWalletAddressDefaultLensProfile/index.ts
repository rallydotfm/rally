import { useQuery } from '@tanstack/react-query'
import { getDefaultProfile } from '@services/lens/profile/getDefaultProfile'

export function useWalletAddressDefaultLensProfile(address: string, options?: any) {
  const queryLensProfile = useQuery(
    ['lens-profile-by-wallet-address', address],
    async () => {
      try {
        const result = await getDefaultProfile({
          ethereumAddress: address,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.defaultProfile
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...options,
    },
  )

  return queryLensProfile
}

export default useWalletAddressDefaultLensProfile
