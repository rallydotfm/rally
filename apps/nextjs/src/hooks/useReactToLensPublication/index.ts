import { useMutation } from '@tanstack/react-query'
import addReactionRequest from '@services/lens/reaction/addReaction'
import removeReactionRequest from '@services/lens/reaction/removeReaction'
import { ReactionTypes } from '@graphql/lens/generated'

export function useReactionLensPublication({ idProfile, idPublication }: { idProfile: string; idPublication: string }) {
  const mutationUpvotePublication = useMutation(
    async () =>
      await addReactionRequest({
        profileId: idProfile,
        reaction: ReactionTypes.Upvote,
        publicationId: idPublication,
      }),
  )
  const mutationDownvotePublication = useMutation(
    async () =>
      await addReactionRequest({
        profileId: idProfile,
        reaction: ReactionTypes.Upvote,
        publicationId: idPublication,
      }),
  )

  const mutationRemoveReaction = useMutation(
    async () =>
      await removeReactionRequest({
        profileId: idProfile,
        publicationId: idPublication,
        reaction: ReactionTypes.Upvote,
      }),
  )

  return {
    mutationUpvotePublication,
    mutationDownvotePublication,
    mutationRemoveReaction,
  }
}

export default useReactionLensPublication
