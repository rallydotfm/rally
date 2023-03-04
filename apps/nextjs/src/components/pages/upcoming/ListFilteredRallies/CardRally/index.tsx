import BadgeRallyState from '@components/BadgeRallyState'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { formatRelative } from 'date-fns'
import Link from 'next/link'

interface CardRallyProps {
  data: {
    name: string
    datetime_start_at: Date
    category: string
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
      <span className="font-bold block mb-2">{formatRelative(data.datetime_start_at, new Date())}</span>
      <div className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
        {data?.image && (
          <div className="relative w-full overflow-hidden xs:w-20 sm:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
            <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
            <img
              alt=""
              loading="lazy"
              width="128px"
              height="86px"
              src={`https://demo-letsrally.infura-ipfs.io/ipfs/${data.image}`}
              className="relative z-10 block w-full h-full object-cover "
            />
          </div>
        )}

        <div className="px-4 flex-grow flex flex-col xs:px-0">
          <h1 className="font-bold flex flex-col-reverse">
            <span className="py-2">{data.name}</span>
            <BadgeRallyState state={data.state} />
          </h1>
          <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
            {data.is_gated ? 'Gated access' : 'Free access'}
          </p>
          <p>{data?.category}</p>
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
