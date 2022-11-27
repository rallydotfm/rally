import Button from '@components/Button'
import { IconInstagram, IconTwitter, IconWebsite } from '@components/Icons'
import useGetListProfilesInterests from '@hooks/useGetProfileInterests'
import type { Profile as LensProfile } from '@graphql/generated'
import { DICTIONARY_PROFILE_INTERESTS } from '@helpers/mappingProfileInterests'
import useGetGuildMembershipsByWalletAddress from '@hooks/useGetGuildMembershipsByWalletAddress'

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
  const queryListProfileInterests = useGetListProfilesInterests()
  const queryListProfileGuilds = useGetGuildMembershipsByWalletAddress(data?.ownedBy)
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
            <Button scale="sm">Follow</Button>
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
        <h2 className="font-semibold text-sm text-neutral-12">Interests</h2>
        <ul className="mt-2 flex flex-wrap gap-1 text-2xs">
          {data.interests?.map((interest) => (
            <li className="px-2 py-0.5 bg-neutral-1 rounded-md font-medium" key={interest}>
              {DICTIONARY_PROFILE_INTERESTS[interest]?.emoji} {DICTIONARY_PROFILE_INTERESTS[interest]?.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="-mx-6 px-6 pt-6 mt-8 border-t border-neutral-1">
        <h2 className="font-semibold text-sm text-neutral-12">Guilds</h2>
      </section>
    </article>
  )
}
export default Profile
