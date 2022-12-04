import { generateChallenge } from '@services/lens/authentication/generateChallenge'
import { authenticate } from '@services/lens/authentication/authenticate'
import { useAccount, useSignMessage } from 'wagmi'
import Cookies from 'js-cookie'
import { COOKIE_LENS_ACCESS_TOKEN, COOKIE_LENS_REFRESH_TOKEN } from '@config/storage'
import create from 'zustand'

interface HasSignedInWithLens {
  isSignedIn: boolean
  setIsSignedIn: (isSignedIn: boolean) => void
}

export const useStoreHasSignedInWithLens = create<HasSignedInWithLens>((set) => ({
  setIsSignedIn: (isSignedIn: boolean) => {
    if (isSignedIn === false) {
      Cookies.remove(COOKIE_LENS_ACCESS_TOKEN)
      Cookies.remove(COOKIE_LENS_REFRESH_TOKEN)
    }
    return set(() => ({ isSignedIn }))
  },
  isSignedIn: Cookies.get(COOKIE_LENS_ACCESS_TOKEN) ? true : false,
}))

export function useSignInWithLens() {
  const { address } = useAccount()
  const setIsSignedIn = useStoreHasSignedInWithLens((state) => state.setIsSignedIn)
  const mutationSignChallengeMessage = useSignMessage({
    async onSuccess(data) {
      try {
        const lensAuthentication = await authenticate({ address, signature: data })
        if (lensAuthentication?.authenticate?.accessToken) {
          Cookies.set(COOKIE_LENS_ACCESS_TOKEN, lensAuthentication?.authenticate?.accessToken, {
            expires: 1 / 48, // 30min
          })
          Cookies.set(COOKIE_LENS_REFRESH_TOKEN, lensAuthentication?.authenticate?.refreshToken, {
            expires: 7, // 7 days
          })
          setIsSignedIn(true)
        } else {
          setIsSignedIn(false)
        }
      } catch (e) {
        console.error(e)
        setIsSignedIn(false)
      }
    },
  })
  async function signIn() {
    const response = await generateChallenge({ address })
    await mutationSignChallengeMessage.signMessageAsync({ message: response.challenge.text })
  }

  return {
    signIn,
    mutationSignChallengeMessage,
  }
}

export default useSignInWithLens
