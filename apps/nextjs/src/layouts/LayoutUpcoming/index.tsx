import NavMenu from '@components/NavMenu'
import { getLayout as getBaseLayout } from '../LayoutBase'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutUpcoming = (props: LayoutProps) => {
  const { children } = props
  return (
    <>
      <div className="-mx-3 md:-mx-6 px-3 md:px-6 pb-4  border-b border-neutral-4">
        <h1 className="font-bold text-xl">Upcoming rallies</h1>
      </div>
      <div className="pt-8">{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutUpcoming>{page}</LayoutUpcoming>)
}

export default LayoutUpcoming
