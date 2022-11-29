import { ROUTE_DASHBOARD_RALLIES, ROUTE_DASHBOARD_RECORDINGS } from '@config/routes'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { getLayout as getProtectedLayout } from '../LayoutWalletRequired'
import { getLayout as getBaseLayout } from '../LayoutBase'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutAccount = (props: LayoutProps) => {
  const { children } = props
  const { pathname } = useRouter()
  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  return (
    <>
      <h1 className="font-bold text-xl">Account</h1>
      <nav className="pt-3 text-xs justify-center bg-black mt-4 -mx-3 px-3 md:-mx-6 md:px-6 min-w-screen md:min-w-unset flex w-auto gap-6 overflow-x-auto border-y border-neutral-4">
        <Link href={ROUTE_DASHBOARD_RALLIES}>
          <a className="pb-3 px-1ex whitespace-nowrap grow-1 shrink-0">Profile</a>
        </Link>
        <Link href={ROUTE_DASHBOARD_RECORDINGS}>
          <a className="pb-3 px-1ex whitespace-nowrap grow-1 shrink-0">Interests</a>
        </Link>
        <Link href={ROUTE_DASHBOARD_RECORDINGS}>
          <a className="pb-3 px-1ex whitespace-nowrap grow-1 shrink-0">Membership</a>
        </Link>
        <Link href={ROUTE_DASHBOARD_RECORDINGS}>
          <a className="pb-3 px-1ex whitespace-nowrap grow-1 shrink-0">Permissions</a>
        </Link>
        <Link href={ROUTE_DASHBOARD_RECORDINGS}>
          <a className="pb-3 px-1ex whitespace-nowrap grow-1 shrink-0">Danger zone</a>
        </Link>
      </nav>
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutAccount>{getProtectedLayout(page)}</LayoutAccount>)
}
export default LayoutAccount
