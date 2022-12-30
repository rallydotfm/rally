import FormSelect from '@components/FormSelect'
import Button from '@components/Button'
import { AdjustmentsHorizontalIcon, ClockIcon } from '@heroicons/react/20/solid'
import FormInput from '@components/FormInput'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'
import { AUDIO_CHATS_SORT_ORDER } from '@helpers/audioChatsSortOptions'
import {
  endOfMonth,
  endOfTomorrow,
  endOfWeek,
  endOfYear,
  getUnixTime,
  startOfMinute,
  startOfMonth,
  endOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfYear,
} from 'date-fns'
import { initialState as initialStateFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import LensProfileSuggestions from '@components/LensProfileSuggestions'

interface FiltersProps {
  queryAudioChats: any
  nameRally: string
  creatorEthAddress: string
  numberFilters: number
  filterStartBetweenRange: Array<number>
  filterCategories: Array<string>
  filterStatuses: Array<number>
  filterShowNSFW: boolean
  filterPublicOnly: boolean
  sortOrder: [string, string]
  setStartBetweenRange: (newOrder: [number, number]) => void
  setSortOrder: (newOrder: [string, string]) => void
  setCreatorEthAddress: (address: string) => void
  setIsModalFiltersOpen: (isOpen: boolean) => void
  setNameRally: (name: string) => void
  clearFilters: () => void
}

export const Filters = (props: FiltersProps) => {
  const {
    setNameRally,
    setCreatorEthAddress,
    nameRally,
    clearFilters,
    creatorEthAddress,
    numberFilters,
    setSortOrder,
    sortOrder,
    setIsModalFiltersOpen,
    filterStartBetweenRange,
    setStartBetweenRange,
  } = props
  const [inputNameRally, setInputNameRally] = useState(nameRally)

  useDebouncedEffect(
    () => {
      setNameRally(inputNameRally)
    },
    [inputNameRally],
    500,
    1000,
  )

  return (
    <>
      <div className="relative z-10 animate-appear grid grid-cols-1 gap-4 p-4 rounded bg-neutral-1 border-neutral-4 border">
        <div>
          <label className="text-2xs text-neutral-12 pb-1 block">Rally name</label>
          <FormInput
            value={inputNameRally}
            onChange={(e) => setInputNameRally(e.currentTarget.value)}
            className="w-full"
            type="text"
            hasError={false}
          />
        </div>
        <div className="flex items-end flex-wrap gap-4">
          <div className="w-full xs:grow xs:w-fit-content">
            <label className="text-2xs text-neutral-12 pb-1 block">Creator Ethereum address</label>
            <div className="relative z-20">
              <LensProfileSuggestions
                onSelectValue={(value: string) => {
                  setCreatorEthAddress(value)
                }}
              />
              <FormInput
                onChange={(e) => setCreatorEthAddress(e.currentTarget.value)}
                type="text"
                value={creatorEthAddress}
                className={'w-full !pis-9'}
                placeholder="0x..."
                hasError={false}
              />
            </div>
          </div>
          <div className=" w-full xs:grow xs:w-fit-content">
            <label className="text-2xs text-neutral-12 pb-1 block">Show rallies starting</label>
            <div className="relative">
              <ClockIcon className="absolute inline-start-2 text-neutral-9 top-1/2 -translate-y-1/2 w-5" />
              <FormSelect
                value={filterStartBetweenRange.toString()}
                classNameInput="!pis-9"
                hasError={false}
                onChange={(e) => {
                  const range = e.target.value.split(',')
                  //@ts-ignore
                  setStartBetweenRange([parseInt(range[0]), parseInt(range[1])])
                }}
              >
                <option value={initialStateFilters.startBetweenRange.toString()}>Any time</option>
                <option value={[getUnixTime(startOfMinute(new Date())), getUnixTime(endOfToday())].toString()}>
                  Later today
                </option>
                <option value={[getUnixTime(startOfTomorrow()), getUnixTime(endOfTomorrow())].toString()}>
                  Tomorrow
                </option>
                <option value={[getUnixTime(startOfWeek(new Date())), getUnixTime(endOfWeek(new Date()))].toString()}>
                  This week
                </option>
                <option value={[getUnixTime(startOfMonth(new Date())), getUnixTime(endOfMonth(new Date()))].toString()}>
                  This month
                </option>
                <option value={[getUnixTime(startOfYear(new Date())), getUnixTime(endOfYear(new Date()))].toString()}>
                  This year
                </option>
              </FormSelect>
            </div>
          </div>
          <div className="w-full flex flex-wrap justify-between gap-4">
            <Button
              type="button"
              className="w-full 2xs:w-auto !pis-3"
              scale="sm"
              intent={numberFilters > 0 ? 'interactive-outline' : 'neutral-outline'}
              onClick={() => setIsModalFiltersOpen(true)}
            >
              <AdjustmentsHorizontalIcon className="w-5 mie-1ex" />
              More filters {numberFilters > 0 && `(${numberFilters})`}
            </Button>
            <Button
              onClick={() => {
                setInputNameRally('')
                clearFilters()
              }}
              className="w-full 2xs:w-auto"
              scale="xs"
              intent="neutral-ghost"
            >
              Clear filters
            </Button>
          </div>
        </div>
      </div>
      <div className="animate-appear pt-6 flex flex-wrap gap-2 justify-between items-center">
        <div className="w-fit-content flex items-center gap-2">
          <label htmlFor="sortSearchRallies" className="text-2xs font-medium text-neutral-11">
            Sort by
          </label>
          <FormSelect
            name="sortSearchRallies"
            className="w-auto"
            value={sortOrder.toString()}
            hasError={false}
            scale="sm"
            //@ts-ignore
            onChange={(e) => {
              const value = e.currentTarget.value.split('.') as [string, string]
              setSortOrder(value)
            }}
          >
            {AUDIO_CHATS_SORT_ORDER.map((order: { label: string; value: string }) => (
              <option value={order.value} key={`search-result-order-${order.value}`}>
                {order.label}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>
    </>
  )
}

export default Filters
