import button from '@components/Button/styles'
import { ROUTE_RALLY_NEW } from '@config/routes'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import Link from 'next/link'
import MenuCurrentUser from '../MenuCurrentUser'
import NavLinks from './NavLinks'

interface MainNavBarProps {
  address?: string
}

export const MainNavBar = (props: MainNavBarProps) => {
  const { address } = props
  const { room } = useStoreLiveVoiceChat()

  return (
    <nav className="bg-black z-20 border-t-2 md:border-none border-neutral-4 fixed h-auto left-0 w-full bottom-0 md:w-auto md:sticky md:top-0 md:inline-start-0 md:h-full md:max-h-screen md:pt-6 flex flex-col md:col-span-1 lg:col-span-2">
      <span aria-hidden="true" className="hidden md:block md:text-2xl md:mx-auto lg:mis-6 md:mb-6">
        📢
      </span>
      <div className="md:mb-6 flex md:flex-col md:space-y-3">
        <NavLinks />
      </div>
      <div className="hidden md:mx-auto md:block lg:mx-6">
        <Link href={ROUTE_RALLY_NEW}>
          <a className={button({ scale: 'sm', class: 'aspect-auto md:aspect-square lg:w-full lg:aspect-auto' })}>
            <PlusIcon className="w-5" />
            <span className="sr-only lg:px-2 lg:not-sr-only">New rally</span>
          </a>
        </Link>
      </div>
      {address && address !== null && (
        <div
          className={`hidden md:mx-auto md:block mt-auto pb-12 md:pt-4 transition-all ${
            room?.state === 'connected' ? 'md:pb-24' : 'md:pb-12'
          }`}
        >
          <MenuCurrentUser address={address} />
        </div>
      )}
    </nav>
  )
}

export default MainNavBar
