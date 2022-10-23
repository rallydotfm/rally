import { HMSRoomProvider, useHMSActions } from '@100mslive/react-sdk'
import { useEffect } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutBase = (props: LayoutProps) => {
  const { children } = props
  const hmsActions = useHMSActions()

  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave()
    }
  }, [hmsActions])

  return (
    <>
      <div className="flex items-center"></div>
      <div>{children}</div>
    </>
  )
}

export const getLayout = (page: any) => {
  return (
    <HMSRoomProvider>
      <LayoutBase>{page}</LayoutBase>
    </HMSRoomProvider>
  )
}
export default LayoutBase
