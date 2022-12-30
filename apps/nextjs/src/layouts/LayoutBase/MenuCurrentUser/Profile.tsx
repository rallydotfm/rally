import { IconSpinner } from '@components/Icons'
import shortenEthereumAddress from '@helpers/shortenEthereumAddress'
import { useSession } from 'next-auth/react'

interface ProfileProps {
  address: string
  queryEns: any
  queryLens: any
}

const Profile = (props: ProfileProps) => {
  const { queryEns, queryLens, address } = props
  const { status } = useSession()

  return (
    <div className="overflow-hidden flex items-center">
      <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            queryLens?.data?.picture?.original?.url
              ? queryLens?.data?.picture?.original?.url.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
              : queryEns?.data?.avatar && queryEns?.data?.avatar !== null
              ? queryEns?.data?.avatar
              : `https://avatars.dicebear.com/api/identicon/${address}.svg`
          }
          alt=""
        />
      </div>

      <div className="flex flex-col whitespace-pre-line">
        {queryLens?.data && (
          <>
            <span className="font-bold text-2xs w-full">{queryLens?.data?.name}&nbsp;</span>
            <span className="text-[0.9em] opacity-50">@{queryLens?.data?.handle}</span>
          </>
        )}
        <span className="text-[0.9em] font-mono opacity-75 text-ellipsis flex items-center overflow-hidden">
          {queryLens?.status === 'loading' && <IconSpinner className="text-sm text-primary-11 mie-1 animate-spin" />}
          {queryEns?.data?.name && queryEns?.data?.name !== null
            ? queryEns?.data?.name
            : shortenEthereumAddress(address)}
        </span>
        {status !== 'authenticated' && (
          <>
            <span className="text-[0.9em] font-semibold animate-appear text-negative-10 pt-0.5">
              Wallet not verified
            </span>
            <span className="text-[0.65em] text-negative-12">Sign out and reconnect your wallet to verify it.</span>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
