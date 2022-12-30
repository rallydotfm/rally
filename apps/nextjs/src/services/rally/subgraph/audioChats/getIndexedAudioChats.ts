import { clientSubgraphRally } from '@config/graphql-request'

/**
 * Fetch indexed audio chats from subgraph
 */

export async function getIndexedAudioChats(audioChatsRequest: any) {
  const result = await clientSubgraphRally.request(
    `
    query AudioChats(
        $first: Int!
        $skip: Int!
        $name: String!
        $gated: [Boolean]!
        $nsfw: [Boolean]!
        $states: [Int]!
        $categories: [String]!
        $creator: String!
        $orderBy: String!
        $orderDirection: String!
        $start_at_min: Int!
        $start_at_max: Int!
    ) {
        audioChats(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: {
                name_contains_nocase: $name
                creator_contains: $creator
                is_gated_in: $gated
                is_nsfw_in: $nsfw
                category_in: $categories
                state_in: $states
                start_at_gte: $start_at_min
                start_at_lte: $start_at_max            
                is_indexed: true
            }
        ) {
            id
            name
            state
            category
            start_at
            creator
            cid_metadata
            is_nsfw
            is_gated
            will_be_recorded
            has_cohosts
            max_attendees
            image
            description
        }
      }
  `,
    {
      ...audioChatsRequest,
    },
  )

  return result
}

export default getIndexedAudioChats
