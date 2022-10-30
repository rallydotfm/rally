import { HMSRoomProvider, useHMSActions } from '@100mslive/react-sdk'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import MobileTopMenu from './MobileTopMenu'
import MainNavBar from './MainNavBar'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutBase = (props: LayoutProps) => {
  const { children } = props
  const { address, isConnecting } = useAccount()

  const hmsActions = useHMSActions()
  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave()
    }
  }, [hmsActions])

  return (
    <div className="relative flex-grow flex flex-col">
      {!isConnecting && !address && (
        <div className="animate-appear z-30 md:fixed py-3 md:bottom-0 md:w-full md:left-0 bg-primary-10 text-primary-3">
          <div className="mx-auto container space-y-2 xs:space-y-0 xs:space-i-3 justify-between xs:items-center flex flex-col xs:flex-row">
            <div>
              <h2 className="font-bold">You&apos;re missing all the fun !</h2>
              <p>Connect your wallet to start using Rally.</p>
            </div>
            <ConnectButton />
          </div>
        </div>
      )}
      <div className="flex-grow pb-12 md:pb-0 flex flex-col md:grid md:grid-cols-12">
        <MainNavBar address={address} />
        <MobileTopMenu address={address} />
        <div className="pt-8 pb-12 md:pb-32 md:border-x md:border-neutral-4 md:border-solid md:col-span-8 px-6 flex-grow">
          {children}
        </div>
        <div className="hidden md:block md:col-span-1 lg:col-span-2 md:pis-6 pb-6">
          <footer className="flex flex-col md:pt-6 text-2xs text-neutral-11">
            <a href="/">About</a>
            <a href="">Github</a>
          </footer>
        </div>
      </div>
    </div>
  )
}

export const getLayout = (page: any) => {
  return (
    <HMSRoomProvider>
      <LayoutBase>{page}</LayoutBase>
    </HMSRoomProvider>
  )
}
export default LayoutBase
