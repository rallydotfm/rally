import button from '@components/Button/styles'
import { ROUTE_RALLY_NEW } from '@config/routes'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import MenuCurrentUser from '../MenuCurrentUser'

interface MobileTopMenuProps {
  address?: string
}
export const MobileTopMenu = (props: MobileTopMenuProps) => {
  const { address } = props
  return (
    <div className="bg-black z-20 border-b-2 px-3 border-neutral-4 sticky w-full flex items-center inset-0 py-2 md:hidden">
      <span aria-hidden="true" className="text-2xl mie-auto">
        📢
      </span>
      {address && address !== null && (
        <div className="static">
          <MenuCurrentUser address={address} />
        </div>
      )}
      <Link href={ROUTE_RALLY_NEW}>
        <a className={button({ scale: 'xs', intent: 'primary-outline', class: 'mis-6 aspect-square xs:aspect-auto' })}>
          <PlusIcon className="w-5 xs:mie-2" />
          <span className="sr-only xs:not-sr-only xs:pie-1">New rally</span>
        </a>
      </Link>
    </div>
  )
}

export default MobileTopMenu
