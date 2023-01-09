import { useEnsIdentity } from '@hooks/useEnsIdentity'

interface EnsAvatarProps {
  address: `0x${string}`
}
export const EnsAvatar = (props: EnsAvatarProps) => {
  const { address } = props
  const queryEnsIdentity = useEnsIdentity(address, {})

  return (
    <div className="shrink-0 w-10 h-10 relative mie-2 bg-neutral-5 rounded-full overflow-hidden">
      <div
        className={`${
          queryEnsIdentity?.isLoadingError ? 'animate-pulse' : ''
        } bg-neutral-5 absolute w-full h-full inset-0"`}
      />
      {queryEnsIdentity?.data?.avatar !== null && (
        <img
          loading="lazy"
          width="40px"
          height="40px"
          className="w-full h-full object-cover overflow-hidden absolute inset-0 z-10"
          src={queryEnsIdentity?.data?.avatar?.replace('ipfs://', 'https://infura-ipfs.io/ipfs/')}
          alt=""
        />
      )}
    </div>
  )
}

export default EnsAvatar
