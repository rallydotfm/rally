import { IconInstagram, IconTwitter, IconWebsite } from '@components/Icons'
import type { Profile as LensProfile } from '@graphql/generated'
import { DICTIONARY_PROFILE_INTERESTS } from '@helpers/mappingProfileInterests'
import useGetGuildMembershipsByWalletAddress from '@hooks/useGetGuildMembershipsByWalletAddress'
import CardGuildMembership from './CardGuildMembership'
import type { GetMembershipsResponse } from '@guildxyz/sdk'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { ROUTE_ACCOUNT } from '@config/routes'
import ButtonFollowOnLens from '@components/ButtonFollowOnLens'
import ButtonUnfollowOnLens from '@components/ButtonUnfollowOnLens'
import button from '@components/Button/styles'

interface ProfileProps {
  data: LensProfile
}

const attributeKeyToIcon = {
  twitter: <IconTwitter />,
  website: <IconWebsite />,
  instagram: <IconInstagram />,
}

export const Profile = (props: ProfileProps) => {
  const { data } = props
  const account = useAccount()
  const queryListProfileGuilds = useGetGuildMembershipsByWalletAddress(data?.ownedBy as `0x${string}`, {
    enabled: true,
  })
  return (
    <article>
      <div>
        <header className="relative -mx-6">
          <img
            className="w-full object-cover h-auto max-h-[30vh]"
            src={data?.coverPicture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/') ?? ''}
            alt=""
          />
        </header>

        <div className="grid grid-cols-2">
          <div className="col-span-1 flex flex-col space-y-2">
            <div className="-mt-12 relative z-10 rounded-full ring-8 ring-black overflow-hidden w-32 h-32 xs:w-40 xs:h-40">
              <img
                className="w-full object-cover h-auto"
                src={data?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/') ?? ''}
                alt=""
              />
            </div>
            <section className="pb-4">
              <h1>
                <span className="font-bold block text-xl">{data.name}</span>
                <span className="font-medium text-neutral-11 block">@{data.handle}</span>
              </h1>
              <div className="grid grid-cols-2 w-max-content gap-6 pt-2">
                <div>
                  <span className="font-bold text-white text-base">
                    {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
                      data?.stats?.totalFollowers,
                    )}
                  </span>{' '}
                  <span className="text-2xs text-neutral-12">followers</span>
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
                  <a className={button({ intent: 'neutral-outline', scale: 'sm' })}>Edit your profile</a>
                </Link>
              </>
            ) : data?.isFollowedByMe ? (
              <>
                <ButtonUnfollowOnLens
                  disabled={!account?.address}
                  scale="sm"
                  intent="negative-outline"
                  profile={data}
                />
              </>
            ) : (
              <>
                <ButtonFollowOnLens disabled={!account?.address} scale="sm" intent="primary-outline" profile={data} />
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
                  <span className="text-xs">{attributeKeyToIcon[`${attr.key}`]}</span>
                  <span className="font-semibold">{attr.key}</span>
                </a>
              </li>
            ))}
        </ul>
      </section>
      <section className="pt-6 mt-8 border-t border-neutral-1">
        <h2 className="animate-appear font-semibold text-sm text-neutral-12">Interests</h2>

        <div className="mt-2">
          {(data?.interests?.length as number) > 0 ? (
            <ul className="flex flex-wrap gap-1 text-2xs">
              {data.interests?.map((interest) => (
                <li className="animate-appear px-2 py-0.5 bg-neutral-1 rounded-md font-medium" key={interest}>
                  {DICTIONARY_PROFILE_INTERESTS[interest]?.emoji} {DICTIONARY_PROFILE_INTERESTS[interest]?.label}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="animate-appear italic text-neutral-9 text-sm">
                {account?.address === data?.ownedBy
                  ? "You didn't set your profile interests yet."
                  : `${data?.name} didn't set their interests yet.`}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="animate-appear -mx-6 px-6 pt-6 mt-8 border-t border-neutral-1">
        <h2 className="font-semibold text-sm text-neutral-12 mb-3">Guilds</h2>
        <ul className="grid grid-cols-1 2xs:grid-cols-2 gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {queryListProfileGuilds?.data?.guilds.map((guild: GetMembershipsResponse) => {
            return (
              <li className="animate-appear col-span-1" key={guild.guildId}>
                <CardGuildMembership id={guild.guildId} />
              </li>
            )
          })}
        </ul>
      </section>
    </article>
  )
}
export default Profile