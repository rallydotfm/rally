import Button from '@components/Button'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import useAddProfileInterest from '@hooks/useAddProfileInterest'
import useRemoveProfileInterest from '@hooks/useRemoveProfileInterest'

interface ListInterestsProps {
  profile: any
  list: Array<string>
}
export const ListInterests = (props: ListInterestsProps) => {
  const { profile, list } = props
  const mutationAddProfileInterest = useAddProfileInterest(profile)
  const mutationRemoveProfileInterest = useRemoveProfileInterest(profile)
  return (
    <>
      <ul className="space-y-6">
        {list
          .filter((label) => !label.includes('__'))
          .map((category) => (
            <li>
              <span className="font-bold">{DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]}</span>
              <ul className="flex flex-wrap gap-3 pt-2">
                <li>
                  <Button
                    className={`!tracking-none`}
                    scale="sm"
                    disabled={
                      (!profile.interests.includes(category) && profile.interests.length === 12) ||
                      mutationAddProfileInterest.isLoading ||
                      mutationRemoveProfileInterest.isLoading
                    }
                    onClick={async () => {
                      if (!profile.interests.includes(category)) await mutationAddProfileInterest.mutateAsync(category)
                      else {
                        await mutationRemoveProfileInterest.mutateAsync(category)
                      }
                    }}
                    intent={profile.interests.includes(category) ? 'neutral-on-dark-layer' : 'neutral-outline'}
                  >
                    {profile.interests.includes(category) && <CheckCircleIcon className="text-interactive-9 w-5" />}
                    <span>
                      {console.log(category)}
                      {DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]}
                    </span>
                  </Button>
                </li>

                {list.filter((label) => label.includes('__') && label.includes(category))?.length > 0 ? (
                  <>
                    {list
                      .filter((label) => label.includes('__') && label.includes(category))
                      .map((interest) => {
                        return (
                          <li>
                            <Button
                              className={`${
                                profile.interests.includes(interest) ? '!pis-1ex' : '!pis-[2ex]'
                              } !tracking-none space-i-1ex`}
                              scale="sm"
                              disabled={
                                (!profile.interests.includes(interest) && profile.interests.length === 12) ||
                                mutationAddProfileInterest.isLoading ||
                                mutationRemoveProfileInterest.isLoading
                              }
                              onClick={async () => {
                                if (!profile.interests.includes(interest))
                                  await mutationAddProfileInterest.mutateAsync(interest)
                                else {
                                  await mutationRemoveProfileInterest.mutateAsync(interest)
                                }
                              }}
                              intent={
                                profile.interests.includes(interest) ? 'neutral-on-dark-layer' : 'neutral-outline'
                              }
                            >
                              {profile.interests.includes(interest) && (
                                <CheckCircleIcon className="text-interactive-9 w-5" />
                              )}
                              <span>
                                {DICTIONARY_PROFILE_INTERESTS[interest]?.emoji}{' '}
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
                      {DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]?.emoji}{' '}
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
