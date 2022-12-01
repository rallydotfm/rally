import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import removeProfileInterest from '@services/lens/profile-interests/removeProfileInterest'

export function useRemoveProfileInterest(profile: any) {
  const queryClient = useQueryClient()
  const mutationRemoveProfileInterest = useMutation(
    async (interest) => {
      await removeProfileInterest({
        profileId: profile.id,
        interests: [interest],
      })
    },
    {
      onError(err) {
        toast.error('Something went wrong, please try updating your interests again.')
      },
      onSuccess(data, removedInterest) {
        queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-wallet-address', profile.ownedBy],
          refetchType: 'none',
        })
        queryClient.setQueryData(['lens-profile-by-wallet-address', profile.ownedBy], (prev: any) => {
          return {
            //@ts-ignore
            ...prev,
            //@ts-ignore
            interests: prev.interests.filter((interest: string) => interest !== removedInterest),
          }
        })
      },
    },
  )

  return mutationRemoveProfileInterest
}

export default useRemoveProfileInterest
