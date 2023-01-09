import { UNLOCK_SUBGRAPH_API_URL } from '@config/unlock'

/**
 * Retrieve locks from subgraph - filtered by lock manager eth address
 * @param chainId - id of the chain we need to retrieve the locks info from
 * @param address - Ethereum address of the lock manager
 */
export async function getLocksByLockManager(args: { chainId: number; address: `0x${string}` }) {
  //@ts-ignore
  const result = await fetch(UNLOCK_SUBGRAPH_API_URL[args.chainId], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Locks($owner: String!) {
          locks(orderBy: createdAtBlock, orderDirection: desc, 
          where:{
            lockManagers_contains: 
            [ $owner ]
          })
           {
            id
            address
            name
            price 
            tokenAddress
            expirationDuration    
            maxNumberOfKeys
          }
        }
      
      `,
      variables: {
        owner: args.address,
      },
    }),
  })

  return result
}

export default getLocksByLockManager
