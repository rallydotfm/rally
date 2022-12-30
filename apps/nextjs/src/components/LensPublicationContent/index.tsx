import { Interweave } from 'interweave'
import { UrlMatcher, MentionMatcher } from 'interweave-autolink'
import type { MatcherInterface } from 'interweave'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { ROUTE_PROFILE } from '@config/routes'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const NoSSRAudioPlayer = dynamic(() => import('./AudioPlayer'), {
  ssr: false,
})

const timestampMatcher: MatcherInterface<any> = {
  inverseName: 'noTimestamp',
  propName: 'timestamp',
  //@ts-ignore
  match(string) {
    const result = string.match(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/)

    if (!result) {
      return null
    }

    return {
      index: result.index!,
      //@ts-ignore
      length: result[0].length,
      //@ts-ignore
      match: result[0],
      extraProp: 'timestamp', // or result[1], etc
      valid: true,
    }
  },
  createElement(children, props) {
    const { query } = useRouter()
    const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)
    const queryClient = useQueryClient()

    return (
      <time
        className="font-mono cursor-pointer font-medium mie-1ex bg-interactive-2 rounded-md px-1.5  text-interactive-11"
        onClick={() => {
          const timestamp = `${children}`
          const transformedTimestamp = timestamp.split(':')
          //@ts-ignore
          const seconds = +transformedTimestamp[0] * 60 * 60 + +transformedTimestamp[1] * 60 + +transformedTimestamp[2]
          if (query?.idRally) {
            const dataRally: any = queryClient.getQueryData(['audio-chat-metadata', query?.idRally])
            const dataRecording: any = queryClient.getQueryData([
              'audio-chat-published-recording-metadata',
              query?.idRally,
              dataRally?.recording,
            ])
            setAudioPlayer({
              isOpen: true,
              trackSrc: dataRecording?.recording_file,
              rally: {
                clickedAt: new Date(),
                timestamp: seconds,
                name: dataRecording?.name,
                imageSrc: dataRecording?.image,
                id: query?.idRally as string,
                //@ts-ignore
                lensPublicationId: dataRally?.lens_publication_id,
                metadata: dataRecording,
              },
            })
          }
        }}
      >
        {children}
      </time>
    )
  },
  asTag() {
    return 'time'
  },
}

export const LensPublicationContent = (props: any) => {
  const { publication, ...rest } = props
  const { pathname } = useRouter()
  return (
    <article>
      <div className="prose w-full prose-invert">
        <Interweave
          {...rest}
          content={publication?.metadata?.content}
          matchers={[new UrlMatcher('url'), new MentionMatcher('mention'), timestampMatcher]}
          mentionUrl={`${process.env.NEXT_PUBLIC_APP_URL}${ROUTE_PROFILE.replace(
            '@[handleLensProfile]',
            '{{mention}}',
          )}${process.env.NEXT_PUBLIC_LENS_API_URL === 'https://api-mumbai.lens.dev' ? '.test' : '.lens'}`}
          newWindow={true}
        />
      </div>
      {publication?.metadata?.media?.length > 0 && (
        <div
          className={`grid ${
            publication?.metadata?.media?.original?.mimeType?.includes('image') || publication?.metadata?.media === 1
              ? 'grid-cols-1'
              : 'flex'
          } gap-3 mt-3 w-full`}
        >
          {publication?.metadata?.media?.map((media: any, i: any) => {
            if (media?.original?.mimeType?.includes('video') && i <= 0)
              return (
                <video
                  preload="none"
                  className="w-full aspect-video max-w-prose mx-auto"
                  width="300"
                  controls
                  src={media?.original?.url}
                ></video>
              )
            else if (media?.original?.mimeType?.includes('audio'))
              return (
                <div className="aspect-square 2xs:aspect-auto max-w-screen-xs">
                  <NoSSRAudioPlayer publication={publication} />
                </div>
              )
            else if (media?.original?.mimeType?.includes('image'))
              return (
                <img
                  loading="lazy"
                  width="300"
                  className="w-full aspect-contain"
                  src={media?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
                />
              )
          })}
        </div>
      )}
    </article>
  )
}

export default LensPublicationContent
