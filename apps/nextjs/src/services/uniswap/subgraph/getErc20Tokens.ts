import { UNISWAP_SUBGRAPH_API_URL } from '@config/uniswap'

/**
 * Retrieve locks from subgraph - filtered by lock manager eth address
 * @param chainId - id of the chain we need to retrieve the locks info from
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
          query Tokens($query: String!) {
            tokens(first: 30 where: {
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
      },
    }),
  })

  return result
}

export default getErc20Tokens
