import { API_NFTPORT_URL } from '@config/nftport'

export async function searchContracts(args: {
  query: string
  chain_id: number
  per_page: number
  current_page: number
}) {
  const { query, chain_id, per_page } = args
  const chainName = chain_id === 1 ? 'ethereum' : 'polygon'
  try {
    const response = await fetch(
      `${API_NFTPORT_URL}/search/contracts?chain=${chainName}&page_size=${per_page}&text=${query}`,
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
