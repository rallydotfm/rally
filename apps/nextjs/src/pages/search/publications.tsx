import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutSearch'
import FormInput from '@components/FormInput'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import useSearchLensPublications from '@hooks/useSearchLensPublications'
import { ROUTE_PROFILE } from '@config/routes'
import { formatRelative } from 'date-fns'

const Page: NextPage = () => {
  const { querySearchLensPublications, inputSearchPublicationsValue, setInputSearchLensPublicationsValue } =
    useSearchLensPublications({})
  return (
    <>
      <Head>
        <title>Search publications - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="animate-appear pt-2 flex-grow flex flex-col">
        <h1 className="text-md font-bold">Search Lens publications</h1>
        <p className="text-xs text-neutral-11 mb-3">
          Explore the world of decentralized social media and uncover new voices by searching for publications posted on
          Lens Protocol.
        </p>
        <div className="mb-6 relative group">
          <MagnifyingGlassIcon className="text-neutral-9 group-focus-within:text-neutral-12 w-5 absolute inline-start-2 top-1/2 -translate-y-1/2" />
          <FormInput
            className="w-full !pis-8"
            value={inputSearchPublicationsValue}
            onChange={(e) => setInputSearchLensPublicationsValue(e?.target?.value)}
            hasError={false}
          />
        </div>
        <section className="-mx-3 md:-mx-6">
          {querySearchLensPublications?.isSuccess && (
            <p className="animate-appear bg-neutral-1 border-t border-neutral-4 p-3 px-3 md:px-6 font-bold text-neutral-11 text-sm">
              {`Search results for "${inputSearchPublicationsValue}"`}
            </p>
          )}

          <ul>
            <>
              {querySearchLensPublications?.isLoading && inputSearchPublicationsValue.trim() !== '' && (
                <>
                  <p className="p-6 text-center font-semibold animate-pulse text-2xs">
                    Searching publications with tags "{inputSearchPublicationsValue}"...
                  </p>
                </>
              )}
              {/* @ts-ignore */}
              {querySearchLensPublications?.isSuccess && querySearchLensPublications?.data?.items?.length === 0 && (
                <>
                  <p className="p-6 text-center italic text-neutral-11 text-2xs">
                    No publication found for "{inputSearchPublicationsValue}"
                  </p>
                </>
              )}
              {/* @ts-ignore */}
              {querySearchLensPublications?.data?.items.map((publication: any) => {
                const { profile } = publication
                return (
                  <li
                    className="relative px-3 hover:bg-neutral-1 md:px-6 border-neutral-4 pis-3 pie-6 py-4 text-sm border-t"
                    key={publication?.id}
                  >
                    <div className="flex gap-4">
                      <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', publication?.id)}>
                        <a className="shrink-0 w-10 xs:w-12 h-10 xs:h-12 bg-neutral-5 rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              //@ts-ignore
                              profile?.picture?.original?.url?.replace(
                                'ipfs://',
                                'https://lens.infura-ipfs.io/ipfs/',
                              ) ?? `https://avatars.dicebear.com/api/identicon/${profile?.ownedBy}.svg`
                            }
                            alt=""
                          />
                        </a>
                      </Link>
                      <div className="flex w-full flex-col">
                        <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile?.handle)}>
                          <a className="inline-flex gap-3 items-baseline">
                            {profile?.name && <span className="font-semibold">{profile?.name}</span>}
                            <span className="text-2xs text-neutral-11 font-medium">@{profile?.handle}</span>
                            <span className="text-neutral-10 text-2xs">
                              {formatRelative(new Date(publication?.createdAt), new Date())}
                            </span>
                          </a>
                        </Link>{' '}
                        <p className="pt-1 pb-2 text-neutral-12">{publication?.metadata?.content}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </>
          </ul>
        </section>
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
