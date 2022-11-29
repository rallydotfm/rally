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
  return (
    <>
      {!session?.data?.address || !account?.address ? (
        <Notice intent="primary-outline" className="mt-9 text-center">
          <h2 className="text-md font-bold">Connect your wallet</h2>
          <p>Please connect your Ethereum wallet and use Polygon Mumbai network to access this page.</p>
        </Notice>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export const getLayout = (page: any) => {
  return <LayoutWalletRequired>{page}</LayoutWalletRequired>
}

export default LayoutWalletRequired
