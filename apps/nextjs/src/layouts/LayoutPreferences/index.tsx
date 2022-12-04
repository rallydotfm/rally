import NavMenu from '@components/NavMenu'
import { getLayout as getProtectedLayout } from '../LayoutWalletRequired'
import { getLayout as getBaseLayout } from '../LayoutBase'
import { ROUTE_PREFERENCES_INTERESTS } from '@config/routes'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutPreferences = (props: LayoutProps) => {
  const { children } = props
  return (
    <>
      <h1 className="font-bold text-xl">Preferences</h1>
      <NavMenu
        routes={[
          {
            label: 'Interests',
            href: ROUTE_PREFERENCES_INTERESTS,
          },
        ]}
      />
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutPreferences>{getProtectedLayout(page)}</LayoutPreferences>)
}

export default LayoutPreferences
