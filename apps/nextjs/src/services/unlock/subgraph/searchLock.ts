import { UNLOCK_SUBGRAPH_API_URL } from '@config/unlock'

/**
 * Retrieve locks from subgraph - filtered by lock name
 * @param chainId - id of the chain we need to retrieve the locks info from
 * @param query - text-based query used to filter locks
 */

export async function searchLocks(args: { chainId: number; query: string }) {
  const result = await fetch(
    //@ts-ignore
    UNLOCK_SUBGRAPH_API_URL[args.chainId],
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Locks($query: String!) {
            locks(orderBy: createdAtBlock, orderDirection: desc, 
            where:{
              name_contains: $query
            })
             {
              id
              address
              name
              symbol
              price 
              tokenAddress
              expirationDuration    
              maxNumberOfKeys
            }
          
        }
        `,
        variables: {
          query: args.query,
        },
      }),
    },
  )

  return result
}

export default searchLocks
