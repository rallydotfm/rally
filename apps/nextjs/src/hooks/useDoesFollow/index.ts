import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import getDoesFollow from '@services/lens/follow/doesFollow'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

export function useDoesFollow(profileId: string) {
  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)
  const account = useAccount()
  const doesFollow = useQuery(
    ['does-follow', profileId, account?.address],
    async () => {
      try {
        const result = await getDoesFollow({
          followInfos: [{ followerAddress: account?.address, profileId: profileId }],
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: profileId && account?.address && isSignedIn ? true : false,
    },
  )
  return doesFollow
}

export default useDoesFollow
