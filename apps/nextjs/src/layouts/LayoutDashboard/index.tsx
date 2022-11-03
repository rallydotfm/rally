import { ROUTE_DASHBOARD_RALLIES, ROUTE_DASHBOARD_RECORDINGS } from '@config/routes'
import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getLayout as getProtectedLayout } from '../LayoutWalletRequired'

interface LayoutProps {
  children: React.ReactNode
}

const tabLinkNavigation = cva(['transition-all pb-2 font-bold border-b-4 text-center text-xs'], {
  variants: {
    state: {
      default: 'text-neutral-10 border-transparent',
      active: 'text-white border-opacity-50 border-white ',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})
export const LayoutDashboard = (props: LayoutProps) => {
  const { children } = props
  const { pathname } = useRouter()
  return (
    <>
      <h1 className="font-bold text-xl">Dashboard</h1>
      <nav className="pt-3 bg-black mt-4 -mx-6 grid grid-cols-2 border-y border-neutral-4">
        <Link href={ROUTE_DASHBOARD_RALLIES}>
          <a className={tabLinkNavigation({ state: pathname === ROUTE_DASHBOARD_RALLIES ? 'active' : 'default' })}>
            Rallies
          </a>
        </Link>
        <Link href={ROUTE_DASHBOARD_RECORDINGS}>
          <a className={tabLinkNavigation({ state: pathname === ROUTE_DASHBOARD_RECORDINGS ? 'active' : 'default' })}>
            Recordings
          </a>
        </Link>
      </nav>
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getProtectedLayout(<LayoutDashboard>{page}</LayoutDashboard>)
}
export default LayoutDashboard
