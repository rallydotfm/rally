import { HomeIcon, CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon as SolidHomeIcon,
  CalendarIcon as SolidCalendarIcon,
  RectangleStackIcon as SolidRectangleStackIcon,
} from '@heroicons/react/24/solid'
import { ROUTE_DASHBOARD, ROUTE_HOME, ROUTE_UPCOMING } from '@config/routes'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
    href: ROUTE_DASHBOARD,
    key: 'dashboard',
    activeIcon: SolidRectangleStackIcon,
    defaultIcon: RectangleStackIcon,
    label: 'Dashboard',
  },
]

export const NavLinks = () => {
  const { pathname } = useRouter()
  return (
    <>
      {routes.map((route) => {
        const isActive = pathname === route.href
        return (
          <Link key={route.key} href={route.href}>
            <a
              className={`py-3 border-b-4 md:border-b-0 w-1/3 lg:px-6 flex justify-center md:items-center md:w-auto lg:justify-start ${
                isActive ? 'font-bold transition-colors  border-b-primary-10' : 'border-b-transparent'
              }`}
            >
              {isActive ? (
                <route.activeIcon className="w-6 md:w-8 lg:w-7" />
              ) : (
                <route.defaultIcon className="w-6 md:w-8 lg:w-7" />
              )}
              <span className="sr-only lg:inline-flex lg:pis-3 lg:not-sr-only">{route.label}</span>
            </a>
          </Link>
        )
      })}
    </>
  )
}

export default NavLinks
