import BadgeRallyState from '@components/BadgeRallyState'
import EthereumAddress from '@components/EthereumAddress'
import { ROUTE_RALLY_VIEW } from '@config/routes'
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
              src={`https://ipfs.io/ipfs/${data?.image}`}
              className="relative z-10 block w-full h-full object-cover "
            />
          </div>
        )}

        <div className="px-4 flex-grow flex flex-col xs:px-0">
          <h1 className="font-bold flex flex-col-reverse">
            <span className="py-2">{data?.name}</span>
            <div className="flex gap-3">
              <BadgeRallyState state={data?.state} />
              <span className="font-semibold text-2xs ">{formatRelative(data.datetime_start_at, new Date())}</span>
            </div>
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
      <Link
        className="absolute z-10 opacity-0 inset-0 w-full h-full"
        href={ROUTE_RALLY_VIEW.replace('[idRally]', data.id)}
      >
        View rally page
      </Link>
    </article>
  )
}

export default CardRally
