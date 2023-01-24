import { clientSubgraphRally } from '@config/graphql-request'

/**
 * Fetch indexed published recordings from subgraph
 */

export async function getIndexedRecordings(recordingsRequest: any) {
  const result = await clientSubgraphRally.request(
    `
    query AudioChats(
        $first: Int!
        $skip: Int!
        $name: String!
        $gated: [Boolean]!
        $nsfw: [Boolean]!
        $categories: [String]!
        $creator: String!
        $orderBy: String!
        $orderDirection: String!
    ) {
        audioChats(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: {
              creator_contains: $creator                
              recording_arweave_transaction_id_not: ""   
              is_indexed: true

              metadata_: {
                name_contains_nocase: $name
                is_gated_in: $gated
                is_nsfw_in: $nsfw
                category_in: $categories
              }

            }
        ) {
            id
            state
            start_at
            creator
            cid_metadata
            metadata {
              name
              category
              is_nsfw
              is_gated
              will_be_recorded
              has_cohosts
              max_attendees
              image
              description
          }
        }
      }
  `,
    {
      ...recordingsRequest,
    },
  )

  return result
}

export default getIndexedRecordings
