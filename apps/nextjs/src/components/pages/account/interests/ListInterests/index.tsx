import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'

interface ListInterestsProps {
  userProfileInterests: Array<string>
  list: Array<string>
}
export const ListInterests = (props: ListInterestsProps) => {
  const { userProfileInterests, list } = props
  return (
    <>
      <ul className="space-y-4">
        {list
          .filter((label) => !label.includes('__'))
          .map((category) => (
            <li>
              <span className="font-bold">{DICTIONARY_PROFILE_INTERESTS_CATEGORIES[category]}</span>
              <ul className="flex flex-wrap gap-2">
                {list.filter((label) => label.includes('__') && label.includes(category))?.length > 0 ? (
                  <>
                    {list
                      .filter((label) => label.includes('__') && label.includes(category))
                      .map((interest) => (
                        <li>
                          {DICTIONARY_PROFILE_INTERESTS[interest]?.emoji}{' '}
                          {DICTIONARY_PROFILE_INTERESTS[interest]?.label}
                        </li>
                      ))}
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
