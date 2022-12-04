import { ROUTE_DASHBOARD_RALLIES, ROUTE_DASHBOARD_RECORDINGS } from '@config/routes'
import NavMenu from '@components/NavMenu'
import { getLayout as getProtectedLayout } from '../LayoutWalletRequired'
import { getLayout as getBaseLayout } from '../LayoutBase'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutDashboard = (props: LayoutProps) => {
  const { children } = props
  return (
    <>
      <h1 className="font-bold text-xl">Dashboard</h1>
      <NavMenu
        routes={[
          {
            label: 'Rallies',
            href: ROUTE_DASHBOARD_RALLIES,
          },
          {
            label: 'Recordings',
            href: ROUTE_DASHBOARD_RECORDINGS,
          },
        ]}
      />
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutDashboard>{getProtectedLayout(page)}</LayoutDashboard>)
}

export default LayoutDashboard
