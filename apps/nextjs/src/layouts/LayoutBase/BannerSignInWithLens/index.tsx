import Button from '@components/Button'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import useSignInWithLens from '@hooks/useSignInWithLens'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
export const BannerSignInWithLens = () => {
  const { signIn, mutationSignChallengeMessage } = useSignInWithLens()
  const rally = useStoreCurrentLiveRally((state: any) => state.rally)
  const isPlayerReady = useAudioPlayer((state) => state.isReady)

  return (
    <div
      className={`animate-appear z-30 ${
        isPlayerReady ? 'md:bottom-[6.75rem]' : rally?.id ? 'md:bottom-[3.125rem]' : 'md:bottom-0'
      } md:fixed py-3  md:w-full md:left-0 bg-primary-1 text-neutral-12`}
    >
      <div className="mx-auto container space-y-3 md:space-y-0 md:space-i-3 justify-between md:items-center flex flex-col md:flex-row">
        <div>
          <h2 className="font-bold mb-2">Join your friends on Lens!</h2>
          <p className="text-xs">It seems you have a Lens account but didn't sign-in with it.</p>
          <p className="text-xs font-bold">Sign-in to Lens to unlock more features.</p>
        </div>
        <Button
          scale="sm"
          className="w-fit-content"
          onClick={signIn}
          isLoading={mutationSignChallengeMessage?.isLoading}
          disabled={mutationSignChallengeMessage?.isLoading}
        >
          Sign-in with Lens
        </Button>
      </div>
    </div>
  )
}

export default BannerSignInWithLens
