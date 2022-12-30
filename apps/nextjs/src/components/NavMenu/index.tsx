import Link from 'next/link'
import { cva } from 'class-variance-authority'
import { useRouter } from 'next/router'

const tabLinkNavigation = cva(
  [
    'transition-all pt-2  pb-1 font-bold xs:border-b-4 focus:bg-neutral-1 text-xs whitespace-nowrap flex-grow text-center shrink-0',
  ],
  {
    variants: {
      state: {
        default: 'text-neutral-10 hover:bg-neutral-1  xs:border-transparent',
        active:
          'text-white bg-neutral-2  hover:bg-interactive-1 rounded-md xs:rounded-none xs:bg-transparent  xs:border-interactive-8 ',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

interface NavMenuProps {
  routes: Array<{
    label: string
    href: string
  }>
}

export const NavMenu = (props: NavMenuProps) => {
  const { routes } = props
  const { asPath } = useRouter()

  return (
    <nav className="pb-3 xs:pb-0 text-xs justify-center bg-black mt-4 -mx-3 md:-mx-6 min-w-screen md:min-w-unset flex flex-col xs:flex-row w-auto gap-y-2 overflow-x-auto md:overflow-x-hidden border-y border-neutral-4">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}>
          <a className={tabLinkNavigation({ state: asPath === route.href ? 'active' : 'default' })}>{route.label}</a>
        </Link>
      ))}
    </nav>
  )
}

export default NavMenu
