import { API_NFTPORT_URL } from '@config/nftport'

export async function getNftContract(args: {
  contract: string
  chain_name: string
  page_size: number
  page_number: number
}) {
  const { chain_name, contract, page_number, page_size } = args
  try {
    const response = await fetch(
      `${API_NFTPORT_URL}/nfts/${contract}?chain=${chain_name}&page_number=${page_number}&page_size=${page_size}&include=metadata&refresh_metadata=false`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY as string,
        },
      },
    )
    const result = await response.json()

    return result
  } catch (e) {
    console.error(e)
    return e
  }
}
