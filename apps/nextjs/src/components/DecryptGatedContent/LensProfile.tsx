import { ROUTE_PROFILE } from '@config/routes'
import useGetLensProfileById from '@hooks/useGetLensProfileById'
import Link from 'next/link'

interface LensProfileProps {
  id: string
}

export const LensProfile = (props: LensProfileProps) => {
  const { id } = props
  const queryLensProfileById = useGetLensProfileById(id, {})
  if (queryLensProfileById?.isLoading) return <>Loading profile data...</>
  if (queryLensProfileById?.isSuccess && queryLensProfileById?.data !== null)
    return (
      <span className="flex items-baseline 2xs:items-center">
        <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', queryLensProfileById?.data?.handle)}>
          <a className="relative flex flex-col 2xs:flex-row 2xs:items-center flex-grow z-20">
            {/**@ts-ignore */}
            {queryLensProfileById?.data?.picture?.original?.url && (
              <div className="shrink-0 w-10 h-10 mb-3 2xs:mb-0 2xs:mie-3 bg-neutral-5 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  //@ts-ignore
                  src={queryLensProfileById?.data?.picture?.original?.url?.replace(
                    'ipfs://',
                    'https://lens.infura-ipfs.io/ipfs/',
                  )}
                  alt=""
                />
              </div>
            )}

            <span className="flex flex-wrap whitespace-pre-line">
              {queryLensProfileById?.data?.name && (
                <span className="font-bold text-[1em] w-full">{queryLensProfileById?.data?.name}&nbsp;</span>
              )}
              <span className="text-[0.9em] opacity-50">@{queryLensProfileById?.data?.handle}</span>
            </span>
          </a>
        </Link>
      </span>
    )
  return <div className="text-2xs text-neutral-11">Something went wrong and we couldn't retrieve this profile.</div>
}
