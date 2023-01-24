import { UNISWAP_SUBGRAPH_API_URL } from '@config/uniswap'

/**
 * Retrieve erc20 tokens from subgraph
 * @param chainId - id of the chain we need to retrieve the token from
 * @param query - free search text on token name
 */
export async function getErc20Tokens(args: { chainId: number; query: string }) {
  //@ts-ignore
  const result = await fetch(UNISWAP_SUBGRAPH_API_URL[args.chainId], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
          query Tokens($query: String!, $orderBy: String!) {
            tokens(
              first: 50 
              orderBy: $orderBy
              orderDirection: desc  
              where: {
                name_contains: $query
                
              })
             {
              id
              symbol
              name
            }
          
        }
        `,
      variables: {
        query: args.query ?? '',
        orderBy: args?.chainId === 1 ? 'volumeUSD' : 'lastPriceUSD',
      },
    }),
  })

  return result
}

export default getErc20Tokens
