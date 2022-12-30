import InputCheckboxToggle from '@components/InputCheckboxToggle'
import { Listbox } from '@headlessui/react'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import button from '@components/Button/styles'
import { CheckCircleIcon, ClockIcon, ShieldExclamationIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon, SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline'

interface ListMoreFiltersProps {
  filtersCategories: Array<string>
  setCategoriesFilter: () => void
  filtersStatuses: Array<string>
  setStatusesFilter: () => void
  filterShowNSFW: boolean
  setFilterShowNSFW: (value: boolean) => void
  filterPublicOnly: boolean
  setFilterPublicOnly: (value: boolean) => void
}
export const ListMoreFilters = (props: ListMoreFiltersProps) => {
  const {
    filtersCategories,
    setCategoriesFilter,
    filtersStatuses,
    setStatusesFilter,
    filterShowNSFW,
    setFilterShowNSFW,
    filterPublicOnly,
    setFilterPublicOnly,
  } = props
  const queryListInterests = useGetProfilesInterests()

  return (
    <div className="animate-appear">
      <Listbox value={filtersStatuses} onChange={setStatusesFilter} multiple horizontal>
        <Listbox.Button className="font-bold">Filter by status</Listbox.Button>
        <Listbox.Options static={true} className="mt-4 grid gap-3 grid-cols-2 2xs:grid-cols-3">
          {[
            {
              icon: ClockIcon,
              label: DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label,
              value: DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
            },
            {
              icon: ShieldCheckIcon,
              label: DICTIONARY_STATES_AUDIO_CHATS.READY.label,
              value: DICTIONARY_STATES_AUDIO_CHATS.READY.value,
            },
            {
              icon: SignalIcon,
              label: DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
              value: DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
            },
            {
              icon: ShieldExclamationIcon,
              label: DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label,
              value: DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.value,
            },
            {
              icon: SignalSlashIcon,
              label: DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
              value: DICTIONARY_STATES_AUDIO_CHATS.FINISHED.value,
            },
          ].map((status) => (
            <Listbox.Option
              className="font-bold border ring-4 ring-transparent ui-selected:ring-interactive-11 cursor-pointer items-center justify-center text-xs flex flex-col gap-2 rounded-md border-neutral-4 aspect-square col-span-1"
              key={`all-status-${status.value}`}
              value={status.value}
            >
              {<status.icon className="w-8" />}
              {status.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <div className="pt-8">
        <InputCheckboxToggle
          checked={filterShowNSFW}
          onChange={(e: boolean) => {
            setFilterShowNSFW(e)
          }}
          label="NSFW"
          helpText="Display rallies marked as 'Non-safe for work'"
        />
      </div>

      <div className="pt-4">
        <InputCheckboxToggle
          checked={filterPublicOnly}
          onChange={(e: boolean) => {
            setFilterPublicOnly(e)
          }}
          label="Public only"
          helpText="Only display non-gated rallies"
        />
      </div>
      <div className="py-6 border-t border-neutral-3 mt-8 space-y-4">
        <span className="font-bold mb-1">Filter by categories</span>
        {queryListInterests?.data
          ?.filter((label) => !label.includes('__'))
          .map((label) => (
            <div key={`filter-category-${label}`}>
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
                          key={`filter-search-rallies-subcategory-${interest}`}
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
