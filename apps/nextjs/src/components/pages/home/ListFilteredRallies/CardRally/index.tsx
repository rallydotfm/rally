import EthereumAddress from '@components/EthereumAddress'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'

import { formatRelative } from 'date-fns'
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
  }
}
export const CardRally = (props: CardRallyProps) => {
  const { data } = props
  return (
    <article
      className={`bg-neutral-1 hover:bg-neutral-2 focus:bg-neutral-3 border-neutral-4 border p-6 rounded-xl h-full relative`}
    >
      <div className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
        <div className="px-4 flex-grow flex flex-col xs:px-0">
          <h1 className="font-bold flex flex-col-reverse">
            <span className="py-2">{data?.name}</span>
            {[DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label, DICTIONARY_STATES_AUDIO_CHATS.READY.label].includes(
              data?.state,
            ) && (
              <div className="flex gap-3">
                <span className="font-semibold text-neutral-11 text-2xs ">
                  {formatRelative(data.datetime_start_at, new Date())}
                </span>
              </div>
            )}
          </h1>
          <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2 text-2xs">
            {/* @ts-ignore */}
            {data?.category && (
              <mark className="bg-transparent text-2xs text-neutral-12 font-medium">
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
      <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}>
        <a className="absolute z-10 opacity-0 inset-0 w-full h-full">View rally page</a>
      </Link>
    </article>
  )
}

export default CardRally
