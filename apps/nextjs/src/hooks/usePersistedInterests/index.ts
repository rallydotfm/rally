import create from 'zustand'
import { persist } from 'zustand/middleware'

// This store is used to persist the profile interests of users that don't have a Lens profile
export const useStorePersistedInterests = create(
  persist(
    (set, get) => ({
      interests: {},
      addInterest: (profileAddress: string, interest: string) => {
        //@ts-ignore
        const previousInterests = get().interests?.[profileAddress] ?? []
        set({
          interests: {
            [profileAddress]: [...previousInterests, interest],
          },
        })
      },
      removeInterest: (profileAddress: string, interest: string) => {
        //@ts-ignore
        const updatedInterests = get().interests?.[profileAddress].filter((i) => i !== interest)
        set({
          interests: {
            [profileAddress]: updatedInterests,
          },
        })
      },
    }),
    {
      name: 'rally.profile_interests',
    },
  ),
)
