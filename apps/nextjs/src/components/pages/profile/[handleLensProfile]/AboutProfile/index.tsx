import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import useGetGuildMembershipsByWalletAddress from '@hooks/useGetGuildMembershipsByWalletAddress'
import CardGuildMembership from './CardGuildMembership'
import { useAccount } from 'wagmi'
import type { Key } from 'react'
import type { Profile as LensProfile } from '@graphql/lens/generated'

interface AboutProfileProps {
  data: LensProfile
}

export const AboutProfile = (props: AboutProfileProps) => {
  const { data } = props
  const account = useAccount()
  const queryListProfileGuilds = useGetGuildMembershipsByWalletAddress(data?.ownedBy as `0x${string}`, {
    enabled: true,
  })

  return (
    <>
      <section className="pt-12 -mx-3 px-3 md:-mx-6 md:px-6">
        <h2 className="animate-appear font-semibold text-sm text-neutral-12">Interests</h2>

        <div className="mt-2">
          {(data?.interests?.length as number) > 0 ? (
            <ul className="flex flex-wrap gap-1 text-2xs">
              {data.interests?.map((interest) => (
                <li className="animate-appear px-2 py-0.5 bg-neutral-1 rounded-md font-medium" key={interest}>
                  {/* @ts-ignore */}
                  <span className="pie-1ex">{DICTIONARY_PROFILE_INTERESTS[interest]?.emoji}</span>
                  {/* @ts-ignore */}
                  {DICTIONARY_PROFILE_INTERESTS[interest]?.label ?? DICTIONARY_PROFILE_INTERESTS_CATEGORIES[interest]}
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

      <section className="animate-appear -mx-3 px-3 md:-mx-6 md:px-6 pt-6 mt-8 border-t border-neutral-1">
        <h2 className="font-semibold text-sm text-neutral-12 mb-3">Guilds</h2>
        <ul className="grid grid-cols-1 2xs:grid-cols-2 gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {queryListProfileGuilds?.data?.guilds.map((guild: { guildId: Key | null | undefined }) => {
            return (
              <li className="animate-appear col-span-1" key={guild.guildId}>
                <CardGuildMembership id={guild.guildId as string} />
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
export default AboutProfile
