import Button from '@components/Button'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { useConnectModal } from '@rainbow-me/rainbowkit'
export const BannerConnectWallet = () => {
  const { openConnectModal } = useConnectModal()
  const isPlayerReady = useAudioPlayer((state) => state.isReady)

  return (
    <div
      className={`animate-appear z-30 ${
        isPlayerReady ? 'md:bottom-[6.75rem]' : 'md:bottom-0'
      } md:fixed py-3 md:w-full md:left-0 bg-primary-10 text-primary-3`}
    >
      <div className="mx-auto container space-y-3 md:space-y-0 md:space-i-3 justify-between md:items-center flex flex-col md:flex-row">
        <div>
          <h2 className="font-bold">Tune-in, you're missing all the fun !</h2>
          <p className="text-xs">Connect your wallet to start using Rally.</p>
          <p className="text-xs font-bold">Make sure to sign the message in your wallet to verify it !</p>
        </div>
        <Button type="button" onClick={openConnectModal} scale="sm" intent="neutral-on-light-layer">
          Connect wallet
        </Button>
      </div>
    </div>
  )
}

export default BannerConnectWallet
