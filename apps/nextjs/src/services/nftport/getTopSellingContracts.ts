import { API_NFTPORT_URL } from '@config/nftport'

export async function getTopSellingContracts(chainId: number) {
  const chainName = chainId === 1 ? 'ethereum' : 'polygon'
  try {
    const response = await fetch(
      `${API_NFTPORT_URL}/contracts/top?page_size=30&page_number=1&period=24h&order_by=volume&chain=${chainName}`,
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
