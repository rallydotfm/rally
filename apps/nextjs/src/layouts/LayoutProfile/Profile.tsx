import { IconInstagram, IconTwitter, IconWebsite } from '@components/Icons'
import { useAccount } from 'wagmi'
import { ROUTE_ACCOUNT, ROUTE_PROFILE_RALLIES } from '@config/routes'
import ButtonFollowOnLens from '@components/ButtonFollowOnLens'
import ButtonUnfollowOnLens from '@components/ButtonUnfollowOnLens'
import button from '@components/Button/styles'
import type { Profile as LensProfile } from '@graphql/lens/generated'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useDoesFollow from '@hooks/useDoesFollow'
import Link from 'next/link'
import { ROUTE_PROFILE, ROUTE_PROFILE_ABOUT, ROUTE_PROFILE_POSTS } from '@config/routes'
import NavMenu from '@components/NavMenu'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'

interface ProfileProps {
  data: LensProfile
  children: React.ReactNode
}

const attributeKeyToIcon = {
  twitter: <IconTwitter />,
  website: <IconWebsite />,
  instagram: <IconInstagram />,
}

export const Profile = (props: ProfileProps) => {
  const { data, children } = props
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const doesFollow = useDoesFollow(data.id)
  return (
    <div className="animate-appear">
      <div>
        <header className="relative -mx-6">
          <img
            className="w-full object-cover h-full max-h-[30vh]"
            //@ts-ignore
            src={data?.coverPicture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/') ?? ''}
            alt=""
          />
        </header>

        <div className="grid grid-cols-2">
          <div className="col-span-1 flex flex-col space-y-2">
            <div
              className={`${
                //@ts-ignore
                data?.coverPicture?.original?.url && data?.coverPicture?.original?.url !== '' ? '-mt-12' : 'mt-8'
              }  relative z-10 rounded-full ring-8 ring-black overflow-hidden w-32 h-32 xs:w-40 xs:h-40`}
            >
              <img
                className="w-full object-cover h-full"
                //@ts-ignore
                src={data?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/') ?? ''}
                alt=""
              />
            </div>

            <section className="pb-4">
              <h1>
                <span className="font-bold block text-xl">{data.name}</span>
                <span className="font-medium items-center text-neutral-11 w-auto flex flex-wrap gap-x-3">
                  <span>@{data.handle} </span>

                  {data?.onChainIdentity?.ens?.name && (
                    <span
                      title="Onchain identity: ENS"
                      className="flex items-center font-mono font-medium bg-primary-1  py-0.5 px-1.5 text-[0.85em] rounded-md text-primary-11"
                    >
                      <CheckBadgeIcon className="w-[1.15rem] text-primary-10 mie-2" />{' '}
                      {data?.onChainIdentity?.ens?.name}
                    </span>
                  )}
                </span>
              </h1>

              <div className="grid grid-cols-2 w-max-content gap-6 pt-2">
                <div>
                  <span className="font-bold text-white text-base">
                    {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
                      data?.stats?.totalFollowers,
                    )}
                  </span>{' '}
                  <span className="text-2xs text-neutral-12">follower{data?.stats?.totalFollowers > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="font-bold text-white text-base">
                    {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
                      data?.stats?.totalFollowing,
                    )}
                  </span>{' '}
                  <span className="text-2xs text-neutral-12">following</span>
                </div>
              </div>

              <p className="pt-2 text-white text-xs">{data.bio}</p>
            </section>
          </div>
          <div className="col-span-1 pt-6 justify-self-end">
            {account?.address === data?.ownedBy ? (
              <>
                <Link href={ROUTE_ACCOUNT}>
                  <a className={button({ intent: 'neutral-outline', scale: 'sm', class: 'text-center' })}>
                    Edit &nbsp;<span className="sr-only 2xs:not-sr-only">your profile</span>
                  </a>
                </Link>
              </>
            ) : (
              <>
                {account?.address && doesFollow?.data?.doesFollow?.[0] && (
                  <>
                    {doesFollow?.data?.doesFollow?.[0]?.follows === true ? (
                      <>
                        <ButtonUnfollowOnLens
                          disabled={!account?.address || !isSignedIn}
                          scale="sm"
                          intent="negative-outline"
                          className="animate-appear"
                          profile={data}
                        />
                      </>
                    ) : (
                      <>
                        <ButtonFollowOnLens
                          disabled={!account?.address || !isSignedIn}
                          scale="sm"
                          intent="primary-outline"
                          className="animate-appear"
                          profile={data}
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <section>
        <ul className="grid grid-cols-2 w-max-content gap-6">
          {data.attributes
            ?.filter((attribute) => ['twitter', 'instagram', 'website'].includes(attribute.key) && attribute?.value)
            .map((attr) => (
              <li className="text-2xs" key={attr.key}>
                <a
                  className="flex text-neutral-12 text-opacity-90 hover:text-opacity-100 focus:text-neutral-11 items-center space-i-1ex"
                  rel="noreferrer noopener"
                  target="_blank"
                  href={
                    attr.key === 'website'
                      ? attr.value
                      : attr.key === 'twitter'
                      ? `https://twitter.com/${attr.value}`
                      : attr.key === 'instagram'
                      ? `https://instagram.com/${attr.value}`
                      : attr.value
                  }
                >
                  {/* @ts-ignore */}
                  <span className="text-xs">{attributeKeyToIcon[`${attr.key}`]}</span>
                  <span className="font-semibold">{attr.key}</span>
                </a>
              </li>
            ))}
        </ul>
      </section>
      <NavMenu
        routes={[
          {
            label: 'About',
            href: ROUTE_PROFILE.replace('[handleLensProfile]', data?.handle),
          },
          {
            label: 'Rallies',
            href: ROUTE_PROFILE_RALLIES.replace('[handleLensProfile]', data?.handle),
          },
          {
            label: 'Posts',
            href: ROUTE_PROFILE_POSTS.replace('[handleLensProfile]', data?.handle),
          },
        ]}
      />
      {children}
    </div>
  )
}
export default Profile
