import create from 'zustand'
import { persist } from 'zustand/middleware'

// This store is used to persist the user's preferences (identity, languages & other)
export const useStorePersistedPreferences = create(
  persist(
    (set, get) => ({
      preferences: {},
      configureIdentity: (
        profileAddress: string,
        identity: {
          useLensProfile: boolean
          displayName: string
          avatarUrl: string
        },
      ) => {
        //@ts-ignore
        const preferences = get().preferences
        //@ts-ignore
        const previousData = get().preferences?.[profileAddress] ?? {}
        set({
          ...preferences,
          preferences: {
            [profileAddress]: {
              ...previousData,
              identity,
            },
          },
        })
      },
      setShowNSFW: (profileAddress: string, value: boolean) => {
        //@ts-ignore
        const preferences = get().preferences
        //@ts-ignore
        const previousData = get().preferences?.[profileAddress] ?? {}
        set({
          preferences: {
            ...preferences,
            [profileAddress]: {
              ...previousData,
              showNSFW: value,
            },
          },
        })
      },
      saveLanguagesSelection: (profileAddress: string, languages: Array<string>) => {
        //@ts-ignore
        const preferences = get().preferences
        //@ts-ignore
        const previousData = get().preferences?.[profileAddress] ?? {}
        set({
          preferences: {
            ...preferences,
            [profileAddress]: {
              ...previousData,
              languages,
            },
          },
        })
      },
    }),
    {
      name: 'rally.preferences',
    },
  ),
)
