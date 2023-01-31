import Notice from '@components/Notice'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
interface LayoutProps {
  children: React.ReactNode
}

export const LayoutWalletRequired = (props: LayoutProps) => {
  const { children } = props
  const session = useSession()
  const account = useAccount()
  //@ts-ignore
  if (!session?.data?.address || !account?.address)
    return (
      <Notice intent="primary-outline" className="mt-9 max-w-screen-xs mx-auto text-center">
        <h2 className="text-md font-bold">Connect your wallet</h2>
        <p className="!font-[500] text-neutral-12 mt-2">
          Please connect and verify your Ethereum wallet to Polygon Mumbai network to access this page.
        </p>
      </Notice>
    )
  return <>{children}</>
}

export const getLayout = (page: any) => {
  return <LayoutWalletRequired>{page}</LayoutWalletRequired>
}

export default LayoutWalletRequired
