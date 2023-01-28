import { HomeIcon, CalendarIcon, WalletIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon as SolidHomeIcon,
  CalendarIcon as SolidCalendarIcon,
  WalletIcon as SolidWalletIcon,
} from '@heroicons/react/24/solid'
import { PATHNAME_DASHBOARD, ROUTE_DASHBOARD, ROUTE_HOME, ROUTE_SEARCH, ROUTE_UPCOMING } from '@config/routes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const routes = [
  {
    href: ROUTE_HOME,
    key: 'home',
    activeIcon: SolidHomeIcon,
    defaultIcon: HomeIcon,
    label: 'Home',
  },
  {
    href: ROUTE_UPCOMING,
    key: 'upcoming',
    activeIcon: SolidCalendarIcon,
    defaultIcon: CalendarIcon,
    label: 'Upcoming',
  },

  {
    href: ROUTE_SEARCH,
    key: 'search',
    activeIcon: MagnifyingGlassIcon,
    defaultIcon: MagnifyingGlassIcon,
    label: 'Search',
  },

  {
    href: ROUTE_DASHBOARD,
    key: 'dashboard',
    activeIcon: SolidWalletIcon,
    defaultIcon: WalletIcon,
    label: 'Dashboard',
    subpath: PATHNAME_DASHBOARD,
  },
]

export const NavLinks = () => {
  const { pathname } = useRouter()
  return (
    <>
      {routes.map((route) => {
        const isActive = route?.subpath ? pathname.includes(route?.subpath) : pathname === route.href
        return (
          <Link
            className={`py-3 border-b-4 md:border-b-0 w-1/3 lg:px-6 flex justify-center md:items-center md:w-auto lg:justify-start ${
              isActive ? 'font-bold transition-colors  border-b-primary-10' : 'border-b-transparent'
            }`}
            key={route.key}
            href={route.href}
          >
            {isActive ? (
              <route.activeIcon className="w-6 text-white md:w-8 lg:w-7" />
            ) : (
              <route.defaultIcon className="w-6 text-white text-opacity-40 md:w-8 lg:w-7" />
            )}
            <span className="sr-only lg:inline-flex lg:pis-3 lg:not-sr-only">{route.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export default NavLinks
