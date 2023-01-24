import { IconSpinner, IconUnlockProtocol } from '@components/Icons'
import useGetNftContract from '@hooks/useGetNftContract'
import { supportedChains } from '@config/lit'
import useGetLockById from '@hooks/useGetLockById'

export const Nft = (props: any) => {
  const { condition } = props
  const { queryNftContract } = useGetNftContract({
    contractAddress: condition?.contractAddress,
    chain: condition?.chain,
  })

  const { queryLockById } = useGetLockById({
    contractAddress: condition?.contractAddress,
    //@ts-ignore
    chainId: parseInt(supportedChains.filter((c: { lit: any }) => c.lit === condition?.chain)?.[0]?.id),
    options: {
      enabled: !queryNftContract?.data?.name || queryNftContract?.isError ? true : false,
    },
  })

  if (queryNftContract?.isLoading || queryLockById?.isLoading)
    return (
      <div className="flex flex-col">
        <div className="mb-3 flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
          <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
            {condition?.contractAddress}
          </span>
        </div>

        <div className="text-[0.75rem] animate-appear flex items-center justify-center space-i-1ex">
          <IconSpinner className="text-lg animate-spin" />
          <p className="font-bold animate-pulse">Loading NFT metadata...</p>
        </div>
        <a
          className="absolute inset-0 h-full w-full opacity-0 z-10"
          target="_blank"
          rel="noopener noreferrer"
          title="View on Rarible"
          href={`https://rarible.com/token/${condition?.chain}/${condition.contractAddress}`}
        >
          View on Rarible
        </a>
      </div>
    )
  if (queryNftContract?.isError && queryLockById?.isError)
    return (
      <div className="animate-appear text-[0.75rem]  flex items-center justify-center space-i-1ex">
        <p className="font-bold animate-pulse">
          Something went wrong and we couldn't retrieve the data associated to the contract of this NFT.
        </p>
        <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
          <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
            {condition?.contractAddress}
          </span>
        </div>
        <a
          className="absolute inset-0 h-full w-full opacity-0 z-10"
          target="_blank"
          rel="noopener noreferrer"
          title="View on Rarible"
          href={`https://rarible.com/token/${condition?.chain}/${condition.contractAddress}`}
        >
          View on Rarible
        </a>
      </div>
    )

  if (queryLockById?.data?.lock)
    return (
      <div className="animate-appear flex gap-4 items-center">
        <IconUnlockProtocol className="text-[2.5rem] shrink-0" />
        <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="font-bold text-[0.95em] block overflow-hidden text-ellipsis">
            {queryLockById?.data?.lock?.name ?? 'Lock'}&nbsp;
          </span>
          <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
            {condition?.contractAddress}
          </span>
          <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
        </div>

        <a
          className="z-10 opacity-0 absolute inset-0 w-full h-full"
          href={`https://app.unlock-protocol.com/checkout?paywallConfig={"title":"Get access to the recording of my rally","locks":{"${
            condition?.contractAddress
          }":{"network":${parseInt(
            //@ts-ignore
            supportedChains.filter((c: { lit: any }) => c.lit === condition?.chain)?.[0]?.id,
          )}}}}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Checkout on Unlock
        </a>
      </div>
    )
  return (
    <div className="animate-appear flex gap-4 items-center">
      {queryNftContract?.data?.contract?.metadata?.thumbnail_url && (
        <div className="shrink-0 w-10 h-10 bg-neutral-5 rounded-full overflow-hidden">
          <img
            loading="lazy"
            width="40px"
            height="40px"
            className="w-full h-full object-cover"
            src={queryNftContract?.data?.contract?.metadata?.thumbnail_url}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
        {queryNftContract?.data?.contract?.name && (
          <span className="font-bold text-[0.95em] block overflow-hidden text-ellipsis">
            {queryNftContract?.data?.contract?.name}&nbsp;
          </span>
        )}
        <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
          {condition?.contractAddress}
        </span>
        <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
      </div>
      <a
        className="absolute inset-0 h-full w-full opacity-0 z-10"
        target="_blank"
        rel="noopener noreferrer"
        title="View on Rarible"
        href={`https://rarible.com/token/${condition?.chain}/${condition.contractAddress}`}
      >
        View on Rarible
      </a>
    </div>
  )
}

export default Nft
