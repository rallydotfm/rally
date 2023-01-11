import { Combobox } from '@headlessui/react'
import input from '@components/FormInput/styles'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import searchLocks from '@services/unlock/subgraph/searchLock'
import getLocksByLockManager from '@services/unlock/subgraph/getLocksByLockManager'
import { UNLOCK_SUBGRAPH_API_URL } from '@config/unlock'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

interface LockSuggestionsProps {
  onSelectValue: any
  chainId: number
  index: number
  data: any
}

export const LockSuggestions = (props: LockSuggestionsProps) => {
  const { onSelectValue, chainId, index, ...formProps } = props
  const { data } = formProps
  const account = useAccount()
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchLockName, setInputSearchContractQueryValue] = useState('')
  const [pickedLock, setPickedLock] = useState(null)
  const queryLocksByWallet = useQuery(
    ['locks-by-manager-address', chainId, account?.address],
    async () => {
      try {
        const response = await getLocksByLockManager({ chainId, address: account?.address as `0x${string}` })
        const result = await response.json()
        return result?.data
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled:
        Object.keys(UNLOCK_SUBGRAPH_API_URL)
          .map((key) => parseInt(key))
          .includes(chainId) && account?.address
          ? true
          : false,
      refetchOnWindowFocus: false,
    },
  )

  const querySearchContracts = useQuery(
    ['search-lock-by-name', debouncedSearchQuery],
    async () => {
      try {
        const response = await searchLocks({
          query: inputSearchLockName,
          chainId: chainId,
        })
        const result = await response.json()
        return result?.data
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled:
        Object.keys(UNLOCK_SUBGRAPH_API_URL)
          .map((key) => parseInt(key))
          .includes(chainId) &&
        account?.address &&
        debouncedSearchQuery.trim() !== ''
          ? true
          : false,
      refetchOnWindowFocus: false,
    },
  )

  useDebouncedEffect(
    () => {
      setDebouncedSearchQuery(inputSearchLockName)
    },
    [inputSearchLockName],
    500,
    2500,
  )

  return (
    <div>
      <div className="group focus-within:z-10 relative">
        <Combobox
          value={inputSearchLockName}
          onChange={(value) => {
            onSelectValue(value)
          }}
        >
          {({ open }) => (
            <>
              <span className="flex font-bold items-center text-neutral-12 pb-2 text-2xs">Search Lock by name</span>
              <Combobox.Button className={'relative w-full'}>
                <MagnifyingGlassIcon
                  className={`${
                    open ? 'text-neutral-12' : 'text-neutral-9'
                  } pointer-events-none transition-all inline-start-2 w-4 absolute top-1/2 -translate-y-1/2`}
                />
                <Combobox.Input
                  placeholder="Search and select a Lock by name"
                  className={input({ class: `w-full  !px-8 ${open ? '!rounded-b-none' : ''}`, scale: 'sm' })}
                  onChange={(event) => setInputSearchContractQueryValue(event.target.value)}
                  value={inputSearchLockName}
                />

                <ChevronDownIcon
                  className={`${
                    open ? 'rotate-180' : 'rotate-0'
                  } pointer-events-none transition-all inline-end-2 w-4 absolute top-1/2 -translate-y-1/2`}
                />
              </Combobox.Button>

              <Combobox.Options className="ui-open:z-10 shadow-lg rounded-b-md absolute top-full inline-start-0 w-full max-h-48 overflow-y-auto pt-2 border bg-[#333333] border-neutral-9 border-t-0 divide-neutral-7 divide-y">
                {queryLocksByWallet?.isSuccess &&
                  queryLocksByWallet?.data?.locks?.length === 0 &&
                  inputSearchLockName.trim() === '' && (
                    <>
                      <p className="p-3 text-center italic text-neutral-11 text-2xs">
                        It seems you didn't create any Lock on this chain.
                      </p>
                    </>
                  )}

                {inputSearchLockName.trim() === '' ||
                querySearchContracts?.isError ||
                //@ts-ignore
                (querySearchContracts?.isSuccess && querySearchContracts?.data?.locks?.length === 0) ? (
                  <>
                    {inputSearchLockName?.trim() !== '' && (
                      <p className="p-3 text-center italic text-neutral-11 text-2xs">
                        No Lock found for query "{inputSearchLockName}"
                      </p>
                    )}

                    {queryLocksByWallet?.data?.locks?.map((lockByManager: any) => (
                      <Combobox.Option
                        onClick={() => setPickedLock(lockByManager)}
                        className="relative ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                        key={`lock-suggested-${chainId}-${lockByManager?.address}`}
                        value={lockByManager?.address}
                      >
                        <div className="overflow-hidden flex items-center">
                          <div className="flex flex-col overflow-hidden text-ellipsis whitespace-pre-line">
                            <span className="font-bold text-2xs w-full overflow-hidden text-ellipsis">
                              {lockByManager?.name}&nbsp;
                            </span>
                            <span className="text-[0.9em] font-mono opacity-50 overflow-hidden text-ellipsis">
                              {lockByManager?.address}
                            </span>
                          </div>
                        </div>
                      </Combobox.Option>
                    ))}
                  </>
                ) : (
                  <>
                    {querySearchContracts?.isLoading && (
                      <>
                        <p className="p-3 text-center animate-pulse text-2xs">Searching "{inputSearchLockName}"...</p>
                      </>
                    )}
                    {/* @ts-ignore */}
                    {querySearchContracts?.isSuccess && querySearchContracts?.data?.locks?.length === 0 && (
                      <>
                        <p className="p-3 text-center italic text-neutral-11 text-2xs">
                          No contract found for query "{inputSearchLockName}"
                        </p>
                      </>
                    )}
                    {/* @ts-ignore */}
                    {querySearchContracts?.data?.locks?.map((lock: any) => {
                      return (
                        <Combobox.Option
                          onClick={() => setPickedLock(lock)}
                          className="ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                          key={`lock-search-${chainId}-${lock?.address}`}
                          value={lock?.address}
                        >
                          <div className="overflow-hidden flex items-center">
                            <div className="flex flex-col overflow-hidden text-ellipsis whitespace-pre-line">
                              <span className="font-bold text-2xs w-full overflow-hidden text-ellipsis">
                                {lock?.name}&nbsp;
                              </span>
                              <span className="text-[0.9em] font-mono opacity-50 overflow-hidden text-ellipsis">
                                {lock?.address}
                              </span>
                            </div>
                          </div>
                        </Combobox.Option>
                      )
                    })}
                  </>
                )}
              </Combobox.Options>
            </>
          )}
        </Combobox>
      </div>

      {/* @ts-ignore */}
      {pickedLock !== null && pickedLock?.address === data()?.access_control_conditions?.[index]?.contractAddress && (
        <div className="animate-appear  border-neutral-4 rounded-md text-2xs mt-6">
          Picked Lock:{' '}
          <span className="font-bold">
            {/* @ts-ignore */}
            <span>{pickedLock?.name}</span> {/* @ts-ignore */}
            {pickedLock?.symbol === '' || (pickedLock?.symbol === null && `(${pickedLock?.symbol})`)}
          </span>
          {/* @ts-ignore */}
          <p className="overflow-hidden text-ellipsis font-mono text-neutral-11">{pickedLock?.address}</p>
        </div>
      )}
      <div className="pt-12 text-center">
        <a className="text-neutral-11 block text-2xs" target="_blank " href="https://unlock-protocol.com/">
          Curious about Unlock Protocol and token-gating/membership NFTs ? <br />
          <span className="underline hover:no-underline">Learn more on Unlock's website</span>
        </a>
        <a className="pt-1.5 text-neutral-11 block text-2xs" target="_blank " href="https://www.flocker.app/">
          or <span className="underline hover:no-underline">create your membership smartcontract on Flocker.</span>
        </a>
      </div>

      {/* We need to add at least one named form element to avoid felte bug */}
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.contractAddress`} />
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.contractType`} />
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.chainID`} />
    </div>
  )
}

export default LockSuggestions
