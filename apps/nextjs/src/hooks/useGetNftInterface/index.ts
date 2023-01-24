import { useQuery } from '@tanstack/react-query'
import { providers, Contract } from 'ethers'
import { chainRPC } from '@config/wagmi'

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

const erc1155InterfaceId = '0xd9b67a26'
const erc721InterfaceId = '0x80ac58cd'

export function useGetNftInterface(args: { contract: `0x${string}`; chainId: number; options?: any }) {
  const queryNFTInterface = useQuery(
    ['nft-contract-interface', args?.contract, args?.chainId],
    async () => {
      try {
        //@ts-ignore
        const provider = new providers.JsonRpcProvider(`${chainRPC?.[parseInt(args?.chainId)]}`)
        const nftContract = new Contract(args?.contract, erc165ABI, provider)
        const supportsErc1155 = await nftContract.supportsInterface(erc1155InterfaceId)
        if (supportsErc1155 === true) return 'ERC1155'

        const supportsErc721 = await nftContract.supportsInterface(erc721InterfaceId)
        if (supportsErc721 === true) return 'ERC721'

        throw new Error('This contract is not a valid ERC-721 or ERC-1155 NFT on this chain')
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...args.options,
    },
  )

  return queryNFTInterface
}

export default useGetNftInterface
