import { IconSpinner } from '@components/Icons'
import useGetNftContract from '@hooks/useGetNftContract'
import { useQuery } from '@tanstack/react-query'
import { Contract, providers } from 'ethers'
import { chainRPC } from '@config/wagmi'
import { erc721ABI } from 'wagmi'
import { supportedChains } from '@config/lit'

const erc165ABI: any = [
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const Nft = (props: any) => {
  const { condition } = props
  const { queryNftContract } = useGetNftContract(condition)
  const queryFallback = useQuery(['nft-contract', condition.contractAddress ?? '', condition.chain ?? ''], async () => {
    const provider = new providers.JsonRpcProvider(
      //@ts-ignore
      `${chainRPC?.[supportedChains.filter((c) => c.lit === condition?.chain)?.[0]?.id]}`,
    )
    const nftContract = new Contract(condition.contractAddress, erc165ABI, provider)
    const supportsErc721 = await nftContract.supportsInterface('0x80ac58cd')
    if (supportsErc721 === true) {
      const erc721Contract = new Contract(condition.contractAddress, erc721ABI, provider)
      const name = await erc721Contract.name()

      return { name }
    }
  })
  if (queryNftContract?.isLoading)
    return (
      <div className="flex flex-col">
        {queryFallback?.data?.name && (
          <span className="font-bold text-[0.95em] block overflow-hidden text-ellipsis">
            {queryFallback?.data?.name}&nbsp;
          </span>
        )}

        <div className="mb-3 flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
          <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
            {condition?.contractAddress}
          </span>
        </div>

        {!queryFallback?.data && (
          <div className="text-[0.75rem] animate-appear flex items-center justify-center space-i-1ex">
            <IconSpinner className="text-lg animate-spin" />
            <p className="font-bold animate-pulse">Loading NFT metadata...</p>
          </div>
        )}
      </div>
    )
  if (queryNftContract?.isError)
    return (
      <div className="animate-appeartext-[0.75rem] animate-appear flex items-center justify-center space-i-1ex">
        <p className="font-bold animate-pulse">
          Something went wrong and we couldn't retrieve the data associated to the contract of this NFT.
        </p>
        <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
          <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
            {condition?.contractAddress}
          </span>
        </div>
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
        <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
        <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
          {condition?.contractAddress}
        </span>
      </div>
    </div>
  )
}

export default Nft
