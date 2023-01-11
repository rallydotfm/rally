import { IconSpinner } from '@components/Icons'
import LensPublicationContent from '@components/LensPublicationContent'
import { ROUTE_PROFILE } from '@config/routes'
import { PublicationTypes } from '@graphql/lens/generated'
import { ArrowsRightLeftIcon } from '@heroicons/react/20/solid'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import getPublicationsRequest from '@services/lens/publications/getPublications'
import { useQuery } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import Link from 'next/link'

import { useAccount } from 'wagmi'

interface LensProfileFeedProps {
  profileId: string
}
export const LensProfileFeed = (props: LensProfileFeedProps) => {
  const { profileId } = props

  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const queryProfileFeed = useQuery(
    ['profile-publications', profileId],
    async () => {
      const result = await getPublicationsRequest(
        {
          profileId,
          publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror],
          limit: 50,
        },
        queryLensProfile?.data?.id,
      )
      return result
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <section className="animate-appear">
      {queryProfileFeed?.isLoading && (
        <div className="mb-6 pt-12 animate-appear flex items-center justify-center space-i-1ex">
          <IconSpinner className="text-lg animate-spin" />
          <p className="font-bold animate-pulse">Loading feed...</p>
        </div>
      )}
      {/* @ts-ignore */}
      {queryProfileFeed?.data?.publications?.items?.length > 0 && (
        <ul className="divide-y divide-neutral-4 -mx-3 md:-mx-6">
          {queryProfileFeed?.data?.publications?.items?.map((publication) => {
            const feedProfile = publication?.profile
            //@ts-ignore
            const profile = publication?.mirrorOf?.profile ? publication?.mirrorOf?.profile : publication?.profile

            return (
              <li
                className={`${
                  //@ts-ignore
                  publication?.indexed === false ? 'animate-pulse' : 'animate-appear'
                } px-3 md:px-6 py-4 text-sm`}
                key={`${publication?.id}`}
              >
                {' '}
                {publication?.__typename === 'Mirror' && (
                  <p className="mb-3 flex items-center gap-x-2 flex-wrap animate-appear font-medium text-neutral-11 text-[0.75rem]">
                    <ArrowsRightLeftIcon className="w-4" />
                    {feedProfile?.name ?? feedProfile?.onChainIdentity?.ens?.name ?? feedProfile?.handle} mirrored
                  </p>
                )}
                {publication?.__typename === 'Comment' && (
                  <p className="mb-3 animate-appear font-medium text-neutral-10 text-2xs">{publication?.__typename}</p>
                )}
                <div className="flex gap-4">
                  <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile?.handle)}>
                    <a className="shrink-0 w-12 h-12 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          //@ts-ignore
                          profile?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/') ??
                          `https://avatars.dicebear.com/api/identicon/${profile?.ownedBy}.svg`
                        }
                        alt=""
                      />
                    </a>
                  </Link>
                  <div className="flex flex-col grow">
                    <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile?.handle)}>
                      <a className="flex gap-3 items-baseline">
                        {profile?.name && <span className="font-semibold">{profile?.name}</span>}
                        <span className="text-2xs text-neutral-11 font-medium">@{profile?.handle}</span>
                      </a>
                    </Link>{' '}
                    <span className="text-neutral-10 text-2xs">
                      {/* @ts-ignore */}
                      {publication?.indexed === false
                        ? 'Indexing...'
                        : formatRelative(new Date(publication?.createdAt), new Date())}
                    </span>
                    <div className="animate-appear pt-1 pb-2 text-neutral-12">
                      <LensPublicationContent noTimestamp publication={publication} />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default LensProfileFeed
