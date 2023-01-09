import { Combobox } from '@headlessui/react'
import input from '@components/FormInput/styles'
import shortenEthereumAddress from '@helpers/shortenEthereumAddress'
import useRecommendedLensProfiles from '@hooks/useRecommendedLensProfiles'
import useSearchLensProfiles from '@hooks/useSearchLensProfiles'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'

export const PickLensProfile = (props: any) => {
  const { index, label, onPickValue, pickType, ...formProps } = props
  const { data, setFields } = formProps
  const [pickedProfile, setPickedProfile] = useState(null)
  const account = useAccount()
  const queryRecommendedLensProfiles = useRecommendedLensProfiles()
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`)
  const { inputSearchLensProfileValue, querySearchLensProfile, setInputSearchLensProfileValue } = useSearchLensProfiles(
    false,
    {},
  )

  return (
    <div>
      <div className="group relative">
        <Combobox
          value={inputSearchLensProfileValue}
          onChange={(value) => {
            onPickValue(value)
          }}
        >
          {({ open }) => (
            <>
              <span className="flex font-bold items-center text-neutral-12 pb-2 text-2xs">
                {label ?? 'Search Lens profile'}
              </span>
              <Combobox.Button className={'w-full relative'}>
                <MagnifyingGlassIcon
                  className={`${
                    open ? 'text-neutral-12' : 'text-neutral-9'
                  } pointer-events-none transition-all inline-start-2 w-4 absolute top-1/2 -translate-y-1/2`}
                />
                <Combobox.Input
                  placeholder="Search and select a user by their Lens handle"
                  className={input({ class: `!px-8 w-full ${open ? '!rounded-b-none' : ''}`, scale: 'sm' })}
                  onChange={(event) => {
                    setInputSearchLensProfileValue(event.target.value)
                  }}
                  value={inputSearchLensProfileValue}
                />
                <ChevronDownIcon
                  className={`${
                    open ? 'rotate-180' : 'rotate-0'
                  } pointer-events-none transition-all inline-end-2 w-4 absolute top-1/2 -translate-y-1/2`}
                />
              </Combobox.Button>

              <Combobox.Options className="ui-open:z-10 shadow-lg rounded-b-md absolute top-full inline-start-0 w-full max-h-48 overflow-y-auto pt-2 border bg-[#333333] border-neutral-9 border-t-0 divide-neutral-7 divide-y">
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
                          disabled={
                            pickType === 'follow' &&
                            (profile?.followNftAddress === '' ||
                              !profile?.followNftAddress ||
                              profile?.followNftAddress === '0x0000000000000000000000000000000000000000')
                          }
                          onClick={() => {
                            setPickedProfile(profile)
                            setInputSearchLensProfileValue(profile?.handle)
                            if (
                              pickType === 'follow' &&
                              profile?.followNftAddress !== '0x0000000000000000000000000000000000000000' &&
                              profile?.followNftAddress &&
                              profile?.followNftAddress !== ''
                            )
                              setFields(
                                `access_control_conditions.${index}.followNftContractAddress`,
                                profile?.followNftAddress,
                              )
                          }}
                          className="disabled:cursor-not-allowed relative ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                          key={`recommended${profile?.handle}`}
                          value={profile?.id}
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
                                {profile?.name ??
                                  profile?.onChainIdentity?.ens?.name ??
                                  shortenEthereumAddress(profile?.ownedBy)}
                                &nbsp;
                              </span>
                              <span className="text-[0.9em] opacity-50">@{profile.handle}</span>
                              {pickType === 'follow' &&
                                (profile?.followNftAddress === '' ||
                                  !profile?.followNftAddress ||
                                  profile?.followNftAddress === '0x0000000000000000000000000000000000000000') && (
                                  <span className="text-[0.85em] italic pt-1">This profile can't be followed.</span>
                                )}
                            </div>
                          </div>
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
                        disabled={
                          pickType === 'follow' &&
                          (profile?.followNftAddress === '' ||
                            !profile?.followNftAddress ||
                            profile?.followNftAddress === '0x0000000000000000000000000000000000000000')
                        }
                        onClick={() => {
                          setPickedProfile(profile)
                          setInputSearchLensProfileValue(profile?.handle)
                          if (
                            pickType === 'follow' &&
                            profile?.followNftAddress !== '0x0000000000000000000000000000000000000000' &&
                            profile?.followNftAddress &&
                            profile?.followNftAddress !== ''
                          )
                            setFields(
                              `access_control_conditions.${index}.followNftContractAddress`,
                              profile?.followNftAddress,
                            )
                        }}
                        className="disabled:cursor-not-allowed ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                        key={`search-${profile?.handle}`}
                        value={profile.id}
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
                              {profile?.name ??
                                profile?.onChainIdentity?.ens?.name ??
                                shortenEthereumAddress(profile?.ownedBy)}
                              &nbsp;
                            </span>
                            <span className="text-[0.9em] opacity-50">@{profile.handle}</span>
                            {pickType === 'follow' &&
                              (profile?.followNftAddress === '' ||
                                !profile?.followNftAddress ||
                                profile?.followNftAddress === '0x0000000000000000000000000000000000000000') && (
                                <span className="text-[0.85em] italic pt-1">This profile can't be followed.</span>
                              )}
                          </div>
                        </div>
                      </Combobox.Option>
                    ))}
                  </>
                )}
              </Combobox.Options>
            </>
          )}
        </Combobox>
      </div>
      {queryUserProfileLens?.data?.handle && (
        <button
          type="button"
          disabled={
            pickType === 'follow' &&
            (queryUserProfileLens?.data?.followNftAddress === '' ||
              !queryUserProfileLens?.data?.followNftAddress ||
              queryUserProfileLens?.data?.followNftAddress === '0x0000000000000000000000000000000000000000')
          }
          onClick={() => {
            //@ts-ignore
            setPickedProfile(queryUserProfileLens?.data)
            onPickValue(queryUserProfileLens?.data?.id)
            if (
              pickType === 'follow' &&
              queryUserProfileLens?.data?.followNftAddress !== '0x0000000000000000000000000000000000000000' &&
              queryUserProfileLens?.data?.followNftAddress &&
              queryUserProfileLens?.data?.followNftAddress !== ''
            )
              setFields(
                `access_control_conditions.${index}.followNftContractAddress`,
                queryUserProfileLens?.data?.followNftAddress,
              )
          }}
          className="font-bold rounded-full transition-all px-[2ex] py-0.5 border bg-transparent hover:bg-interactive-3 focus:bg-interactive-11 hover:focus:bg-opacity-95  text-neutral-12 focus:text-interactive-3  border-interactive-9 focus:border-interactive-11 text-[0.8rem] mt-2"
        >
          Pick my profile
        </button>
      )}
      {/* @ts-ignore */}
      {pickedProfile !== null && pickedProfile?.id === data()?.access_control_conditions?.[index]?.profileId && (
        <div className="animate-appear text-2xs mt-6">
          Picked profile:{' '}
          <span className="font-mono text-neutral-11">{data()?.access_control_conditions?.[index]?.profileId}</span>
          <div className="pt-2 overflow-hidden flex items-center">
            <div className="shrink-0 w-10 h-10 mie-2 bg-neutral-5 rounded-full overflow-hidden">
              <img
                loading="lazy"
                width="40px"
                height="40px"
                className="w-full h-full object-cover"
                /* @ts-ignore */
                src={pickedProfile?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
                alt=""
              />
            </div>
            <div className="flex flex-col whitespace-pre-line">
              <span className="font-bold text-2xs w-full">
                {/* @ts-ignore */}
                {pickedProfile?.name ??
                  //@ts-ignore
                  pickedProfile?.onChainIdentity?.ens?.name ??
                  //@ts-ignore
                  shortenEthereumAddress(pickedProfile?.ownedBy)}
                &nbsp;
              </span>
              {/* @ts-ignore */}
              <span className="text-[0.9em] opacity-50">@{pickedProfile.handle} </span>
            </div>
          </div>
          {/* @ts-ignore */}
        </div>
      )}
      <div className="pt-12 text-center">
        <a
          className="text-neutral-11 font-normal block text-2xs"
          target="_blank "
          href="https://docs.lens.xyz/docs/profile/"
        >
          Curious about Lens profiles ? <br />
          <span className="underline hover:no-underline">Learn more on Lens's website.</span>
        </a>
      </div>
      {/* We need to add at least one named form element to avoid felte bug */}
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.profileId`} />
      {pickType === 'follow' && (
        <input
          className="sr-only"
          disabled
          hidden
          name={`access_control_conditions.${index}.followNftContractAddress`}
        />
      )}
    </div>
  )
}
export default PickLensProfile
