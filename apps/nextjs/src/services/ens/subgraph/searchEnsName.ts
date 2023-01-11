import { ENS_SUBGRAPH_API_URL } from '@config/ens'

/**
 * Retrieve locks from subgraph - filtered by lock manager eth address
 * @param chainId - id of the chain we need to retrieve the locks info from
 * @param query - free search text on ENS name
 */
export async function searchEnsName(args: { query: string }) {
  const result = await fetch(ENS_SUBGRAPH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
          query Domains($query: String!) {
            domains(first: 30 where: {
                 name_contains: $query
                 resolvedAddress_not: null 
                }
            ) {
              id
              name
              resolvedAddress {
                  id
                }
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

export default searchEnsName
