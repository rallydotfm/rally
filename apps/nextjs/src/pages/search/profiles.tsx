import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutSearch'
import useSearchLensProfiles from '@hooks/useSearchLensProfiles'
import FormInput from '@components/FormInput'
import useRecommendedLensProfiles from '@hooks/useRecommendedLensProfiles'
import shortenEthereumAddress from '@helpers/shortenEthereumAddress'
import { ROUTE_PROFILE } from '@config/routes'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Page: NextPage = () => {
  const queryRecommendedLensProfiles = useRecommendedLensProfiles()
  const { querySearchLensProfile, inputSearchLensProfileValue, setInputSearchLensProfileValue } = useSearchLensProfiles(
<<<<<<< HEAD
    false,
=======
>>>>>>> d3d8ced (MVP (#8))
    {},
  )

  return (
    <>
      <Head>
        <title>Search profiles - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear pt-2 flex-grow flex flex-col">
        <h1 className="text-md font-bold">Search Lens users</h1>
        <p className="text-xs text-neutral-11 mb-3">
          Find and follos new and interesting content creators within the Lens Protocol ecosystem using their unique
          Lens profile.
        </p>
        <div className="mb-6 relative group">
          <MagnifyingGlassIcon className="text-neutral-9 group-focus-within:text-neutral-12 w-5 absolute inline-start-2 top-1/2 -translate-y-1/2" />
          <FormInput
            className="w-full !pis-8"
            value={inputSearchLensProfileValue}
            onChange={(e) => setInputSearchLensProfileValue(e?.target?.value)}
            hasError={false}
          />
        </div>
        <section className="-mx-3 md:-mx-6">
          <p className="bg-neutral-1 border-t border-neutral-4 p-3 px-3 md:px-6 font-bold text-neutral-11 text-sm">
            {querySearchLensProfile?.isSuccess
              ? `Search results for "${inputSearchLensProfileValue}"`
              : 'Recommended profiles'}
          </p>
          <ul>
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
                    <li
                      className="relative px-3 hover:bg-neutral-1 md:px-6 border-neutral-4 pis-3 pie-6 py-4 text-sm border-t animate-appear"
                      key={`search-recommended-${profile?.handle}`}
                    >
                      <div className="overflow-hidden flex items-center">
                        <div className="shrink-0 w-12 h-12 mie-4 bg-neutral-5 rounded-full overflow-hidden">
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
                          <span className="pt-2 group-hover:text-primary-9 text-primary-10 text-2xs font-semibold">
                            View profile
                          </span>
                        </div>
                      </div>
                      <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile.handle)}>
                        <a className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0">
                          Visit {profile?.name ?? profile.handle} profile
                        </a>
                      </Link>
                    </li>
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
                    <p className="p-6 text-center italic text-neutral-11 text-2xs">
                      No profile found for "{inputSearchLensProfileValue}"
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                {querySearchLensProfile?.isLoading && (
                  <>
                    <p className="p-6 text-center animate-pulse text-2xs">
                      Searching "{inputSearchLensProfileValue}"...
                    </p>
                  </>
                )}
                {/* @ts-ignore */}
                {querySearchLensProfile?.isSuccess && querySearchLensProfile?.data?.items?.length === 0 && (
                  <>
                    <p className="p-6 text-center italic text-neutral-11 text-2xs">
                      No profile found for "{inputSearchLensProfileValue}"
                    </p>
                  </>
                )}
                {/* @ts-ignore */}
                {querySearchLensProfile?.data?.items.map((profile: any) => (
                  <li
                    className="relative px-3 hover:bg-neutral-1 md:px-6 border-neutral-4 pis-3 pie-6 py-4 text-sm border-t animate-appear"
                    key={`search-${profile?.handle}`}
                  >
                    <div className="overflow-hidden flex items-center">
                      <div className="shrink-0 w-12 h-12 mie-4 bg-neutral-5 rounded-full overflow-hidden">
                        <img
                          loading="lazy"
                          width="40px"
                          height="40px"
                          className="w-full h-full object-cover"
                          src={profile?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col whitespace-pre-line">
                        <span className="font-bold text-2xs w-full">
                          {profile?.name ?? shortenEthereumAddress(profile?.ownedBy)}&nbsp;
                        </span>
                        <span className="text-[0.9em] opacity-50">@{profile.handle}</span>
                        <span className="pt-2 group-hover:text-primary-9 text-primary-10 text-2xs font-semibold">
                          View profile
                        </span>
                      </div>
                    </div>
                    <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile.handle)}>
                      <a className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0">
                        Visit {profile?.name ?? profile.handle} profile
                      </a>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
