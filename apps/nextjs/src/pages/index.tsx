import button from '@components/Button/styles'
import { ROUTE_PREFERENCES_INTERESTS } from '@config/routes'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import useGetAudioChatByState from '@hooks/useGetAudioChatByStatus'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useAccount } from 'wagmi'
const Page: NextPage = () => {
  const account = useAccount()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )
  const { queriesAudioChatsByStateMetadata, queryAudioChatsByStateRawData } = useGetAudioChatByState([
    DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
    DICTIONARY_STATES_AUDIO_CHATS.READY.value,
    DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
  ])

  return (
    <>
      <Head>
        <title>Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="pt-8 max-w-screen-sm mx-auto">
        {queryLensProfile?.isSuccess && (
          <>
            {queryLensProfile?.data?.interests?.length === 0 ||
              (queryLensProfile?.data === null &&
                (interests?.[account?.address as `0x${string}`]?.length === 0 ||
                  !interests?.[account?.address as `0x${string}`]) && (
                  <aside className="border flex flex-wrap gap-3 items-center justify-between border-neutral-4 p-4 text-2xs text-white font-semibold rounded-md animate-appear mb-12">
                    <p>Want to see more accurate rooms ?</p>
                    <Link href={ROUTE_PREFERENCES_INTERESTS}>
                      <a
                        className={button({
                          intent: 'primary-outline',
                          scale: 'xs',
                        })}
                      >
                        Pick interests
                      </a>
                    </Link>
                  </aside>
                ))}
          </>
        )}

        <h1 className="text-center font-bold text-3xl">
          Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities.
        </h1>
        <p className="pt-8 text-center text-neutral-11">
          This page is under construction and will be implemented in our 6th milestone.
        </p>
      </main>
    </>
  )
}

export default Page
