import BadgeRallyState from '@components/BadgeRallyState'
import Button from '@components/Button'
import EthereumAddress from '@components/EthereumAddress'
import { IconSpinner } from '@components/Icons'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import { PlayIcon } from '@heroicons/react/20/solid'
import useGetAudioChatPublishedRecording from '@hooks/useGetAudioChatPublishedRecording'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import Link from 'next/link'

interface CardRallyProps {
  data: {
    category: string
    name: string
    datetime_start_at: Date
    language: string
    image?: string
    id: string
    is_gated: boolean
    state: string
    will_be_recorded: boolean
    recording_arweave_transaction_id: string
  }
}
export const CardRally = (props: CardRallyProps) => {
  const { data } = props
  const { queryPublishedRecording } = useGetAudioChatPublishedRecording(data.id, data.recording_arweave_transaction_id)
  const setAudioPlayer = useAudioPlayer((state: any) => state.setAudioPlayer)
  const playedRally = useAudioPlayer((state: any) => state.rally)
  const stateVoiceChat: any = useStoreLiveVoiceChat()

  return (
    <article className={`relative`}>
      <div className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
        {data?.image && (
          <div className="shrink-0 relative w-full overflow-hidden xs:w-20 sm:w-28 aspect-twitter-card xs:aspect-auto xs:grow xs:max-w-56 rounded-t-md xs:rounded-b-md">
            <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
            <img
              alt=""
              loading="lazy"
              width="128px"
              height="86px"
              src={`${data?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')}`}
              className="relative z-10 block w-full h-full object-cover "
            />
          </div>
        )}

        <div className="px-4 flex-grow flex flex-col xs:px-0">
          <h1 className="font-bold flex flex-col-reverse">
            <span className="py-2">{queryPublishedRecording?.data?.name ?? data?.name}</span>
          </h1>
          <div className="flex items-center mt-2 gap-4 text-2xs">
            {/* @ts-ignore */}
            {data?.category && (
              <mark className="bg-neutral-1 text-2xs text-neutral-12 py-0.5 px-2 rounded-md font-medium">
                {/* @ts-ignore */}
                {`${DICTIONARY_PROFILE_INTERESTS?.[data?.category]?.emoji} ` ?? ''}&nbsp;
                {/* @ts-ignore */}
                {DICTIONARY_PROFILE_INTERESTS?.[data?.category]?.label ??
                  // @ts-ignore
                  DICTIONARY_PROFILE_INTERESTS_CATEGORIES?.[data?.category]}
              </mark>
            )}

            {data?.language && (
              <mark className="bg-transparent text-interactive-12 font-semibold">
                {/* @ts-ignore */}
                {DICTIONARY_LOCALES_SIMPLIFIED?.[data?.language]}
              </mark>
            )}
          </div>
          <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
            {data?.is_gated ? 'Gated access' : 'Free access'}
          </p>
          <p className="mt-4 flex flex-col gap-2 font-medium text-2xs">
            <span className="italic opacity-75">Hosted by </span>

            <EthereumAddress
              displayLensProfile={true}
              shortenOnFallback={true}
              //@ts-ignore
              address={data?.creator}
            />
          </p>
        </div>
      </div>
      {data?.will_be_recorded && data?.recording_arweave_transaction_id !== '' && (
        <div className="relative animate-appear z-20 mt-6">
          {queryPublishedRecording?.isLoading && (
            <div className="flex items-center justify-center space-i-1ex">
              <IconSpinner className="text-xs animate-spin" />
              <p className="font-bold animate-pulse">Loading recording...</p>
            </div>
          )}

          {queryPublishedRecording?.isSuccess && queryPublishedRecording?.data?.recording_file && (
            <div>
              <Button
                disabled={stateVoiceChat?.room?.state === 'connected' || playedRally?.id === data?.id}
                intent="interactive-outline"
                onClick={() => {
                  setAudioPlayer({
                    isOpen: true,
                    trackSrc: queryPublishedRecording?.data?.recording_file,
                    rally: {
                      clickedAt: new Date(),
                      timestamp: 0,
                      name: queryPublishedRecording?.data?.name,
                      imageSrc: queryPublishedRecording?.data?.image,
                      id: data.id,
                      //@ts-ignore
                      lensPublicationId: data?.lens_publication_id,
                      metadata: queryPublishedRecording?.data,
                    },
                  })
                }}
                scale="xs"
                className={`${playedRally?.id !== data?.id ? '!pis-2 !pie-3' : ''} `}
              >
                {playedRally?.id === data?.id ? (
                  <>Playing</>
                ) : (
                  <>
                    <PlayIcon className="w-4 mie-1ex" />
                    Play recording
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}>
        <a className="absolute z-10 opacity-0 inset-0 w-full h-full">View rally page</a>
      </Link>
    </article>
  )
}

export default CardRally
