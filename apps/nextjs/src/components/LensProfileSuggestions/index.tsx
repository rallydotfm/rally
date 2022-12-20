import useRecommendedLensProfiles from '@hooks/useRecommendedLensProfiles'
import { Combobox, Popover } from '@headlessui/react'
import shortenEthereumAddress from '@helpers/shortenEthereumAddress'
import input from '@components/FormInput/styles'
import useSearchLensProfiles from '@hooks/useSearchLensProfiles'
import Button from '@components/Button'
import { UserPlusIcon } from '@heroicons/react/20/solid'

interface LensProfileSuggestionsProps {
  onSelectValue: any
}

export const LensProfileSuggestions = (props: LensProfileSuggestionsProps) => {
  const { onSelectValue } = props
  const queryRecommendedLensProfiles = useRecommendedLensProfiles()
  const { inputSearchLensProfileValue, querySearchLensProfile, setInputSearchLensProfileValue } = useSearchLensProfiles(
    {},
  )
  return (
    <>
      <Popover className="peer">
        <Popover.Button
          intent="interactive-outline"
          className="aspect-square h-[75%] absolute inline-start-1 !rounded top-1/2 !p-0 -translate-y-1/2 "
          as={Button}
          title="Check suggested profiles"
        >
          <UserPlusIcon className="w-4" />
          <span className="sr-only">Check suggested profiles</span>
        </Popover.Button>
        <Popover.Panel className="border border-neutral-7 border-solid absolute focus:ring-interactive-9 text-xs rounded-md w-full top-full z-10 max-h-[33vh] overflow-y-auto inline-start-0">
          <Combobox
            value={inputSearchLensProfileValue}
            onChange={(value) => {
              onSelectValue(value)
            }}
          >
            <div className="p-3 bg-neutral-5 border-b border-neutral-8">
              <span className="text-[0.75rem] font-medium text-neutral-12">Search Lens profile</span>
              <Combobox.Input
                className={input({ class: 'w-full mt-1', scale: 'sm' })}
                onChange={(event) => setInputSearchLensProfileValue(event.target.value)}
                value={inputSearchLensProfileValue}
              />
            </div>

            <Combobox.Options className="pt-2 bg-neutral-5 divide-neutral-7 divide-y" static>
              {inputSearchLensProfileValue === '' ||
              querySearchLensProfile?.isError ||
              //@ts-ignore
              (querySearchLensProfile?.isSuccess && querySearchLensProfile?.data?.items?.length === 0) ? (
                <>
                  {queryRecommendedLensProfiles?.data
                    ?.filter((profile: any) => {
                      if (inputSearchLensProfileValue === '') return profile
                      if (
                        profile?.name?.toLowerCase()?.includes(inputSearchLensProfileValue.toLowerCase()) ||
                        profile?.handle?.toLowerCase()?.includes(inputSearchLensProfileValue.toLowerCase())
                      )
                        return profile
                    })
                    .map((profile: any) => (
                      <Combobox.Option
                        className="relative ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                        key={`recommended-${profile?.handle}`}
                        value={profile?.ownedBy}
                      >
                        <div className="overflow-hidden flex items-center">
                          <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                            <img
                              loading="lazy"
                              width="40px"
                              height="40px"
                              className="w-full h-full object-cover"
                              src={profile?.picture?.original?.url?.replace(
                                'ipfs://',
                                'https://lens.infura-ipfs.io/ipfs/',
                              )}
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col whitespace-pre-line">
                            <span className="font-bold text-2xs w-full">
                              {profile?.name ?? shortenEthereumAddress(profile?.ownedBy)}&nbsp;
                            </span>
                            <span className="text-[0.9em] opacity-50">@{profile.handle}</span>
                          </div>
                        </div>
                        <Popover.Button className="z-10 absolute top-0 left-0 w-full h-full block opacity-0">
                          Select this person and close
                        </Popover.Button>
                      </Combobox.Option>
                    ))}
                  {queryRecommendedLensProfiles?.data?.filter((profile: any) => {
                    if (inputSearchLensProfileValue === '') return profile
                    if (
                      profile?.name?.toLowerCase()?.includes(inputSearchLensProfileValue.toLowerCase()) ||
                      profile?.handle?.toLowerCase()?.includes(inputSearchLensProfileValue.toLowerCase())
                    )
                      return profile
                  })?.length === 0 && (
                    <>
                      <p className="p-3 text-center italic text-neutral-11 text-2xs">
                        No profile found for "{inputSearchLensProfileValue}"
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  {querySearchLensProfile?.isLoading && (
                    <>
                      <p className="p-3 text-center animate-pulse text-2xs">
                        Searching "{inputSearchLensProfileValue}"...
                      </p>
                    </>
                  )}
                  {/* @ts-ignore */}
                  {querySearchLensProfile?.isSuccess && querySearchLensProfile?.data?.items?.length === 0 && (
                    <>
                      <p className="p-3 text-center italic text-neutral-11 text-2xs">
                        No profile found for "{inputSearchLensProfileValue}"
                      </p>
                    </>
                  )}
                  {/* @ts-ignore */}
                  {querySearchLensProfile?.data?.items.map((profile: any) => (
                    <Combobox.Option
                      className="ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                      key={`recommended-${profile?.handle}`}
                      value={profile.ownedBy}
                    >
                      <div className="overflow-hidden flex items-center">
                        <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                          <img
                            loading="lazy"
                            width="40px"
                            height="40px"
                            className="w-full h-full object-cover"
                            src={profile?.picture?.original?.url?.replace(
                              'ipfs://',
                              'https://lens.infura-ipfs.io/ipfs/',
                            )}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col whitespace-pre-line">
                          <span className="font-bold text-2xs w-full">
                            {profile?.name ?? shortenEthereumAddress(profile?.ownedBy)}&nbsp;
                          </span>
                          <span className="text-[0.9em] opacity-50">@{profile.handle}</span>
                        </div>
                      </div>
                    </Combobox.Option>
                  ))}
                </>
              )}
            </Combobox.Options>
          </Combobox>
        </Popover.Panel>
      </Popover>
    </>
  )
}

export default LensProfileSuggestions
