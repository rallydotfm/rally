import { ROUTE_SEARCH, ROUTE_SEARCH_PUBLICATIONS, ROUTE_SEARCH_PROFILES, ROUTE_SEARCH_RECORDINGS } from '@config/routes'
import NavMenu from '@components/NavMenu'
import { getLayout as getBaseLayout } from '../LayoutBase'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutSearch = (props: LayoutProps) => {
  const { children } = props
  return (
    <>
      <h1 className="font-bold text-xl">Search</h1>
      <NavMenu
        routes={[
          {
            label: 'Rallies',
            href: ROUTE_SEARCH,
          },
          {
            label: 'Recordings',
            href: ROUTE_SEARCH_RECORDINGS,
          },
          {
            label: 'Publications',
            href: ROUTE_SEARCH_PUBLICATIONS,
          },
          {
            label: 'Profiles',
            href: ROUTE_SEARCH_PROFILES,
          },
        ]}
      />
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutSearch>{page}</LayoutSearch>)
}

export default LayoutSearch
