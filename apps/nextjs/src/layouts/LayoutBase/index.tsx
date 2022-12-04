import { useAccount } from 'wagmi'
import { ProviderLiveVoiceChat } from '@hooks/useVoiceChat/Provider'
import MobileTopMenu from './MobileTopMenu'
import MainNavBar from './MainNavBar'
import BannerConnectWallet from './BannerConnectWallet'
import BannerSignInWithLens from './BannerSignInWithLens'
import ToolbarAudioRoom from './ToolbarAudioRoom'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import DialogModalListParticipantsWithRaisedHands from '@components/pages/rally/[idRally]/DialogModalListParticipantsWithRaisedHands'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'

// The feature below will be disabled until the `updateRoomMetadata` feature is fixed on Livekit server
// import DialogModalPinItem from '@components/pages/rally/[idRally]/DialogModalPinItem'
interface LayoutProps {
  children: React.ReactNode
}

export const LayoutBase = (props: LayoutProps) => {
  const { children } = props
  const stateVoiceChat: any = useStoreLiveVoiceChat()

  const { address, isConnecting } = useAccount({
    async onDisconnect() {
      await stateVoiceChat?.room?.disconnect()
    },
  })

  const queryCurrentUserLensProfile = useWalletAddressDefaultLensProfile(
    address as `0x${string}`,
    address ? true : false,
  )
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  return (
    <div className="relative flex-grow flex flex-col">
      {!isConnecting && !address && <BannerConnectWallet />}
      {address && !isSignedIn && <BannerSignInWithLens />}
      <div className="flex-grow pb-12 md:pb-0 flex flex-col md:grid md:grid-cols-12">
        <MainNavBar address={address} />
        <MobileTopMenu address={address} />
        <div
          className={`pt-5  ${
            stateVoiceChat?.room.state === 'connected' && !isSignedIn && queryCurrentUserLensProfile?.data?.handle
              ? 'pb-20 md:pb-56'
              : stateVoiceChat?.room.state === 'connected'
              ? 'pb-20 md:pb-48'
              : 'pb-12 md:pb-32'
          } md:border-x flex flex-col md:border-neutral-4 md:border-solid md:col-span-8 px-3 md:px-6 flex-grow`}
        >
          <p className="w-full text-center text-[0.775rem] pb-8 text-neutral-9">
            Rally is under heavy development. Bugs may occur - proceed with caution !
          </p>
          {children}
        </div>
        <div
          className={`transition-all ${
            stateVoiceChat?.room?.localParticipant ? 'z-20 translate-y-0' : 'z-[-1] translate-y-full'
          } fixed bottom-12 md:bottom-0 w-full pointer-events-none z-20`}
        >
          {stateVoiceChat?.room?.localParticipant?.permissions?.canPublishData === true && (
            <div className="grid md:grid-cols-12 px-3 lg:px-6 mb-3 pointer-events-none">
              <div className="flex flex-col md:col-start-2 lg:col-start-3 md:col-end-10 lg:col-end-11 w-fit-content mis-auto items-end space-y-3 ">
                <DialogModalListParticipantsWithRaisedHands />
                {/* <DialogModalPinItem /> */}
              </div>
            </div>
          )}
          {stateVoiceChat?.room.state === 'connected' && stateVoiceChat?.room?.sid !== '' && (
            <div
              className={`transition-all pointer-events-auto border-transparent flex py-1 bg-neutral-1 md:bg-black border-y-neutral-4 border`}
            >
              <ToolbarAudioRoom />
            </div>
          )}
        </div>
        <div className="hidden md:block md:col-span-1 lg:col-span-2 md:pis-6 pb-6">
          <footer className="flex flex-col md:pt-6 space-y-3 text-2xs text-neutral-11">
            <a href="https://twitter.com/rallydotfm">Twitter</a>
            <a rel="noreferrer noopener" href="https://github.com/rallydotfm/rally/">
              Github
            </a>
          </footer>
        </div>
      </div>
    </div>
  )
}

export const getLayout = (page: any) => {
  return (
    <ProviderLiveVoiceChat>
      <LayoutBase>{page}</LayoutBase>
    </ProviderLiveVoiceChat>
  )
}
export default LayoutBase
