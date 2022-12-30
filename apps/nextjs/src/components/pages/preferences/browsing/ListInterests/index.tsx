import Button from '@components/Button'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import useAddProfileInterest from '@hooks/useAddProfileInterest'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import useRemoveProfileInterest from '@hooks/useRemoveProfileInterest'
import { useAccount } from 'wagmi'

interface ListInterestsProps {
  source: any
  list: Array<string>
  profile: any
}
export const ListInterests = (props: ListInterestsProps) => {
  const { source, profile, list } = props
  const account = useAccount()
  const mutationAddProfileInterest = useAddProfileInterest(profile)
  const mutationRemoveProfileInterest = useRemoveProfileInterest(profile)
  const addInterestToLocalStorage = useStorePersistedInterests((state: any) => state.addInterest)
  const removeInterestFromLocalStorage = useStorePersistedInterests((state: any) => state.removeInterest)

  return (
    <>
      <ul className="space-y-6 animate-appear">
        {list
          .filter((label) => !label.includes('__'))
          .map((category) => (
            <li key={`list-interests-browsing-preferences${category}`}>
              {/* @ts-ignore */}
              <span className="font-bold">{DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]}</span>
              <ul className="flex flex-wrap gap-3 pt-2">
                <li>
                  <Button
                    className={`!tracking-none`}
                    scale="sm"
                    disabled={
                      (!source?.includes(category) && source?.length === 12) ||
                      mutationAddProfileInterest.isLoading ||
                      mutationRemoveProfileInterest.isLoading
                    }
                    onClick={async () => {
                      if (profile !== null) {
                        !source?.includes(category)
                          ? //@ts-ignore
                            await mutationAddProfileInterest.mutateAsync(category)
                          : //@ts-ignore

                            await mutationRemoveProfileInterest.mutateAsync(category)
                      } else {
                        !source?.includes(category)
                          ? addInterestToLocalStorage(account?.address, category)
                          : removeInterestFromLocalStorage(account?.address, category)
                      }
                    }}
                    intent={source?.includes(category) ? 'neutral-on-dark-layer' : 'neutral-outline'}
                  >
                    {source?.includes(category) && <CheckCircleIcon className="text-interactive-9 w-5" />}
                    {/* @ts-ignore */}
                    <span>{DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]}</span>
                  </Button>
                </li>

                {list.filter((label) => label.includes('__') && label.includes(category))?.length > 0 ? (
                  <>
                    {list
                      .filter((label) => label.includes('__') && label.includes(category))
                      .map((interest) => {
                        return (
                          <li key={`interest-${interest}`}>
                            <Button
                              className={`${
                                source?.includes(interest) ? '!pis-1ex' : '!pis-[2ex]'
                              } !tracking-none space-i-1ex`}
                              scale="sm"
                              disabled={
                                (!source?.includes(interest) && source?.length === 12) ||
                                mutationAddProfileInterest.isLoading ||
                                mutationRemoveProfileInterest.isLoading
                              }
                              onClick={async () => {
                                if (profile !== null) {
                                  !source?.includes(interest)
                                    ? //@ts-ignore
                                      await mutationAddProfileInterest.mutateAsync(interest)
                                    : //@ts-ignore

                                      await mutationRemoveProfileInterest.mutateAsync(interest)
                                } else {
                                  !source?.includes(interest)
                                    ? addInterestToLocalStorage(account?.address, interest)
                                    : removeInterestFromLocalStorage(account?.address, interest)
                                }
                              }}
                              intent={source?.includes(interest) ? 'neutral-on-dark-layer' : 'neutral-outline'}
                            >
                              {source?.includes(interest) && <CheckCircleIcon className="text-interactive-9 w-5" />}
                              <span>
                                {/* @ts-ignore */}
                                {DICTIONARY_PROFILE_INTERESTS[interest]?.emoji}
                                {/* @ts-ignore */}
                                {DICTIONARY_PROFILE_INTERESTS[interest]?.label}
                              </span>
                            </Button>
                          </li>
                        )
                      })}
                  </>
                ) : (
                  <>
                    <li>
                      {/* @ts-ignore */}
                      {DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]?.emoji}
                      {/* @ts-ignore */}
                      {DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]?.label}
                    </li>
                  </>
                )}
              </ul>
            </li>
          ))}
      </ul>
    </>
  )
}

export default ListInterests
