import NavMenu from '@components/NavMenu'
import { getLayout as getProtectedLayout } from '../LayoutWalletRequired'
import { getLayout as getBaseLayout } from '../LayoutBase'
import { ROUTE_PREFERENCES_BROWSING, ROUTE_PREFERENCES_LANGUAGES, ROUTE_PREFERENCES_ROOM } from '@config/routes'

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
            label: 'Browsing',
            href: ROUTE_PREFERENCES_BROWSING,
          },
          {
            label: 'Room',
            href: ROUTE_PREFERENCES_ROOM,
          },
          {
            label: 'Languages',
            href: ROUTE_PREFERENCES_LANGUAGES,
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
