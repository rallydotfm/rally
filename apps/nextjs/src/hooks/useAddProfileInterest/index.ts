import { useMutation, useQueryClient } from '@tanstack/react-query'
import addProfileInterest from '@services/lens/profile-interests/addProfileInterest'
import toast from 'react-hot-toast'

export function useAddProfileInterest(profile: any) {
  const queryClient = useQueryClient()
  const mutationAddProfileInterest = useMutation(
    async (interest) => {
      await addProfileInterest({
        profileId: profile.id,
        interests: [interest],
      })
    },
    {
      onError(err) {
        toast.error('Something went wrong, please try updating your interests again.')
      },
      onSuccess(data, newInterest) {
        queryClient.invalidateQueries({
          queryKey: ['lens-profile-by-wallet-address', profile.ownedBy],
          refetchType: 'none',
        })
        queryClient.setQueryData(['lens-profile-by-wallet-address', profile.ownedBy], (prev: any) => {
          return {
            //@ts-ignore
            ...prev,

            interests: [...prev.interests, newInterest],
          }
        })
      },
    },
  )

  return mutationAddProfileInterest
}

export default useAddProfileInterest
