import { Combobox, Popover } from '@headlessui/react'
import input from '@components/FormInput/styles'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import button from '@components/Button/styles'
import getErc20Tokens from '@services/uniswap/subgraph/getErc20Tokens'

interface Erc20ContractSuggestionsProps {
  onSelectValue: any
  chainId: number
}

export const Erc20ContractSuggestions = (props: Erc20ContractSuggestionsProps) => {
  const { onSelectValue, chainId } = props
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchContractQueryValue, setInputSearchContractQueryValue] = useState('')

  const querySearchContracts = useQuery(
    ['search-erc20-token-by-name', debouncedSearchQuery, chainId],
    async () => {
      try {
        const response = await getErc20Tokens({
          query: inputSearchContractQueryValue,
          chainId: chainId,
        })
        const result = await response.json()
        console.log(result)
        return result?.data
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: [1, 137, 10, 42161, 42220].includes(chainId) ? true : false,
      refetchOnWindowFocus: false,
    },
  )

  useDebouncedEffect(
    () => {
      setDebouncedSearchQuery(inputSearchContractQueryValue)
    },
    [inputSearchContractQueryValue],
    500,
    2500,
  )

  return (
    <>
      <Popover className="peer">
        <Popover.Button
          className={button({
            intent: 'interactive-outline',
            class: 'aspect-square h-[75%] absolute inline-start-1 !rounded top-1/2 !p-0 -translate-y-1/2',
          })}
          title="Check suggested ERC-20 token contract"
        >
          <MagnifyingGlassIcon className="w-4" />
          <span className="sr-only">Check suggested ERC-20 token contract</span>
        </Popover.Button>
        <Popover.Panel className="border border-neutral-7 border-solid absolute focus:ring-interactive-9 text-xs rounded-md w-full top-full z-10 max-h-[33vh] overflow-y-auto inline-start-0">
          <Combobox
            value={inputSearchContractQueryValue}
            onChange={(value) => {
              onSelectValue(value)
            }}
          >
            <div className="p-3 bg-neutral-5 border-b border-neutral-8">
              <span className="text-[0.75rem] font-medium text-neutral-12">Search ERC-20 token by name</span>
              <Combobox.Input
                className={input({ class: 'w-full mt-1', scale: 'sm' })}
                onChange={(event) => setInputSearchContractQueryValue(event.target.value)}
                value={inputSearchContractQueryValue}
              />
            </div>

            <Combobox.Options className="pt-2 bg-neutral-5 divide-neutral-7 divide-y" static>
              {querySearchContracts?.isLoading && (
                <>
                  <p className="p-3 text-center animate-pulse text-2xs">
                    Searching "{inputSearchContractQueryValue}"...
                  </p>
                </>
              )}
              {/* @ts-ignore */}
              {querySearchContracts?.isSuccess && querySearchContracts?.data?.search_results?.length === 0 && (
                <>
                  <p className="p-3 text-center italic text-neutral-11 text-2xs">
                    No contract found for query "{inputSearchContractQueryValue}"
                  </p>
                </>
              )}
              {/* @ts-ignore */}
              {querySearchContracts?.data?.tokens?.map((contract: any) => {
                return (
                  <Combobox.Option
                    className="ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                    key={`erc20-token-search-${chainId}-${contract?.id}`}
                    value={contract?.id}
                  >
                    <div className="overflow-hidden flex items-center">
                      <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
                        <span className="font-bold text-2xs block overflow-hidden text-ellipsis">
                          {contract?.name}&nbsp; (${contract?.symbol})
                        </span>
                        <span className="text-[0.9em] font-mono block opacity-50 overflow-hidden text-ellipsis">
                          {contract?.id}
                        </span>
                      </div>
                    </div>
                  </Combobox.Option>
                )
              })}
            </Combobox.Options>
          </Combobox>
        </Popover.Panel>
      </Popover>
    </>
  )
}

export default Erc20ContractSuggestions
