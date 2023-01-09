import { Combobox, Popover } from '@headlessui/react'
import input from '@components/FormInput/styles'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useDebouncedEffect } from '@react-hookz/web'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTopSellingContracts } from '@services/nftport/getTopSellingContracts'
import { searchContracts } from '@services/nftport/searchContracts'
import button from '@components/Button/styles'

interface NFTContractSuggestionsProps {
  onSelectValue: any
  chainId: number
}

const RESULTS_PER_PAGE = 50

export const NFTContractSuggestions = (props: NFTContractSuggestionsProps) => {
  const { onSelectValue, chainId } = props
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchContractQueryValue, setInputSearchContractQueryValue] = useState('')
  const [currentPageSearchResults, setCurrentPageSearchResults] = useState(1)
  const querySuggestedTopContracts = useQuery(
    ['suggested-top-contracts', chainId],
    async () => {
      try {
        const result = await getTopSellingContracts(chainId)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: [1, 137].includes(chainId) ? true : false,
      refetchOnWindowFocus: false,
    },
  )

  const querySearchContracts = useQuery(
    ['search-nft-contract', debouncedSearchQuery, currentPageSearchResults, RESULTS_PER_PAGE],
    async () => {
      try {
        const result = await searchContracts({
          query: inputSearchContractQueryValue,
          chain_id: chainId,
          per_page: RESULTS_PER_PAGE,
          current_page: currentPageSearchResults,
        })
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: [1, 137].includes(chainId) && debouncedSearchQuery.trim() !== '' ? true : false,
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
          title="Check suggested NFT contract"
        >
          <MagnifyingGlassIcon className="w-4" />
          <span className="sr-only">Check suggested NFT contract</span>
        </Popover.Button>
        <Popover.Panel className="border border-neutral-7 border-solid absolute focus:ring-interactive-9 text-xs rounded-md w-full top-full z-10 max-h-[33vh] overflow-y-auto inline-start-0">
          <Combobox
            value={inputSearchContractQueryValue}
            onChange={(value) => {
              onSelectValue(value)
            }}
          >
            <div className="p-3 bg-neutral-5 border-b border-neutral-8">
              <span className="text-[0.75rem] font-medium text-neutral-12">Search NFT collection</span>
              <Combobox.Input
                className={input({ class: 'w-full mt-1', scale: 'sm' })}
                onChange={(event) => setInputSearchContractQueryValue(event.target.value)}
                value={inputSearchContractQueryValue}
              />
            </div>

            <Combobox.Options className="pt-2 bg-neutral-5 divide-neutral-7 divide-y" static>
              {inputSearchContractQueryValue.trim() === '' ||
              querySearchContracts?.isError ||
              //@ts-ignore
              (querySearchContracts?.isSuccess && querySearchContracts?.data?.items?.length === 0) ? (
                <>
                  {inputSearchContractQueryValue?.trim() !== '' && (
                    <p className="p-3 text-center italic text-neutral-11 text-2xs">
                      No contract found for query "{inputSearchContractQueryValue}"
                    </p>
                  )}

                  {querySuggestedTopContracts?.data?.contracts?.map((topContract: any) => (
                    <Combobox.Option
                      className="relative ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                      key={`nft-suggested-${topContract?.chain}-${topContract?.contract_address}`}
                      value={topContract?.contract_address}
                    >
                      <div className="overflow-hidden flex items-center">
                        <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                          <img
                            loading="lazy"
                            width="40px"
                            height="40px"
                            className="w-full h-full object-cover"
                            src={topContract?.metadata?.thumbnail_url}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden text-ellipsis whitespace-pre-line">
                          <span className="font-bold text-2xs w-full overflow-hidden text-ellipsis">
                            {topContract?.name}&nbsp;
                          </span>
                          <span className="text-[0.9em] font-mono opacity-50 overflow-hidden text-ellipsis">
                            {topContract?.contract_address}
                          </span>
                        </div>
                      </div>
                      <Popover.Button className="z-10 absolute top-0 left-0 w-full h-full block opacity-0">
                        Select this contract
                      </Popover.Button>
                    </Combobox.Option>
                  ))}
                </>
              ) : (
                <>
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
                  {querySearchContracts?.data?.search_results?.map((contract: any) => {
                    return (
                      <Combobox.Option
                        className="ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                        key={`nft-search-${contract?.chain}-${contract?.contract_address}`}
                        value={contract?.contract_address}
                      >
                        <div className="overflow-hidden flex items-center">
                          <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                            <img
                              loading="lazy"
                              width="40px"
                              height="40px"
                              className="w-full h-full object-cover"
                              src={contract?.metadata?.thumbnail_url}
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
                            <span className="font-bold text-2xs block overflow-hidden text-ellipsis">
                              {contract?.name}&nbsp;
                            </span>
                            <span className="text-[0.9em] font-mono block opacity-50 overflow-hidden text-ellipsis">
                              {contract?.contract_address}
                            </span>
                          </div>
                        </div>
                      </Combobox.Option>
                    )
                  })}
                </>
              )}
            </Combobox.Options>
          </Combobox>
        </Popover.Panel>
      </Popover>
    </>
  )
}

export default NFTContractSuggestions
