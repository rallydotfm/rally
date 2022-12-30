import InputCheckboxToggle from '@components/InputCheckboxToggle'
import { Listbox } from '@headlessui/react'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import button from '@components/Button/styles'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

interface ListMoreFiltersProps {
  filtersCategories: Array<string>
  setCategoriesFilter: () => void
  filterShowNSFW: boolean
  setFilterShowNSFW: (value: boolean) => void
}
export const ListMoreFilters = (props: ListMoreFiltersProps) => {
  const { filtersCategories, setCategoriesFilter, filterShowNSFW, setFilterShowNSFW } = props
  const queryListInterests = useGetProfilesInterests()

  return (
    <div className="animate-appear">
      <div className="pt-8">
        <InputCheckboxToggle
          checked={filterShowNSFW}
          onChange={(e: boolean) => {
            setFilterShowNSFW(e)
          }}
          label="NSFW"
          helpText="Display recordings marked as 'Non-safe for work'"
        />
      </div>

      <div className="py-6 border-t border-neutral-3 mt-8 space-y-4">
        <span className="font-bold mb-1">Filter by categories</span>
        {queryListInterests?.data
          ?.filter((label) => !label.includes('__'))
          .map((label) => (
            <div key={`filter-recording-category-${label}`}>
              <Listbox value={filtersCategories} onChange={setCategoriesFilter} multiple horizontal>
                <Listbox.Button className=" text-xs italic text-neutral-11">
                  {/* @ts-ignore */}
                  {DICTIONARY_PROFILE_INTERESTS_CATEGORIES[label]}
                </Listbox.Button>
                <Listbox.Options className="text-neutral-12 pt-2 flex flex-wrap gap-3" static={true}>
                  <Listbox.Option
                    className={button({
                      class: `${filtersCategories?.includes(label) ? '!pis-1ex' : ''} !tracking-none space-i-1ex`,
                      scale: 'xs',
                      intent: filtersCategories?.includes(label) ? 'neutral-on-dark-layer' : 'neutral-outline',
                    })}
                    value={label}
                  >
                    {filtersCategories?.includes(label) && <CheckCircleIcon className="text-interactive-9 w-5" />}
                    {/* @ts-ignore */}
                    <span>{DICTIONARY_PROFILE_INTERESTS_CATEGORIES[label]}</span>
                  </Listbox.Option>
                  {queryListInterests?.data
                    ?.filter((interest) => interest.includes('__') && interest.includes(label))
                    .map((interest) => (
                      <>
                        <Listbox.Option
                          key={`filter-search-recordings-subcategory-${interest}`}
                          className={button({
                            scale: 'xs',
                            intent: filtersCategories?.includes(interest) ? 'neutral-on-dark-layer' : 'neutral-outline',
                            class: `${
                              filtersCategories?.includes(interest) ? '!pis-1ex' : ''
                            } !tracking-none space-i-1ex`,
                          })}
                          value={interest}
                        >
                          {filtersCategories?.includes(interest) && (
                            <CheckCircleIcon className="text-interactive-9 w-5" />
                          )}
                          {/* @ts-ignore */}
                          <span>{DICTIONARY_PROFILE_INTERESTS[interest].label}</span>
                        </Listbox.Option>
                      </>
                    ))}
                </Listbox.Options>
              </Listbox>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ListMoreFilters
