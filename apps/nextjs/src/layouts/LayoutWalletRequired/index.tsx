import Notice from '@components/Notice'
import { useAccount, useNetwork } from 'wagmi'
import { getLayout as getBaseLayout } from '../LayoutBase'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutWalletRequired = (props: LayoutProps) => {
  const { children } = props
  const { address, isConnecting } = useAccount()
  const { chain } = useNetwork()
  return (
    <>
      {children}

      {!isConnecting && !address && (
        <Notice intent="primary-outline" className="mt-9 text-center">
          <h2 className="text-md font-bold">Connect your wallet</h2>
          <p>Please connect your Ethereum wallet to access this page.</p>
        </Notice>
      )}
      {chain?.unsupported === true && (
        <Notice intent="primary-outline" className="mt-9 mx-auto w-fit-content text-center">
          Please switch to Mumbai testnet to interact with this page.
        </Notice>
      )}
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutWalletRequired>{page}</LayoutWalletRequired>)
}

export default LayoutWalletRequired
