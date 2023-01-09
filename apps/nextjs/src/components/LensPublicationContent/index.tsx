import { Interweave } from 'interweave'
import { UrlMatcher, MentionMatcher } from 'interweave-autolink'
import type { MatcherInterface } from 'interweave'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { ROUTE_PROFILE } from '@config/routes'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import VideoPlayer from './VideoPlayer'
import { livepeerClient, livepeerTheme } from '@config/livepeer'
import { LivepeerConfig } from '@livepeer/react'
import { useGetDecryptedLensPublication, useStoreDecryptPublication } from '@hooks/useGetDecryptedLensPublication'
import { useMountEffect, useUpdateEffect } from '@react-hookz/web'
import Button from '@components/Button'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { useAccount } from 'wagmi'

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
  const { mutationInitializeDecryptor, mutationDecryptPublication } = useGetDecryptedLensPublication()
  const sdk = useStoreDecryptPublication((state: any) => state?.sdk)
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const account = useAccount()
  useMountEffect(() => {
    if (
      isSignedIn === true &&
      account?.address &&
      publication?.isGated === true &&
      publication?.canDecrypt === true &&
      sdk
    ) {
      mutationDecryptPublication.mutate(publication?.metadata)
    }
  })

  useUpdateEffect(() => {
    if (
      isSignedIn === true &&
      account?.address &&
      sdk &&
      publication.isGated === true &&
      publication?.canDecrypt === true
    ) {
      mutationDecryptPublication.mutate(publication?.metadata)
    }
  }, [isSignedIn, sdk, account?.address, publication?.isGated, publication?.canDecrypt])

  if (publication?.isGated && sdk) {
    return (
      <article className="flex flex-col">
        This publication is gated.
        <Button
          scale="sm"
          className="mt-3 w-fit-content mx-auto"
          intent="primary-outline"
          isLoading={mutationInitializeDecryptor?.isLoading}
          disabled={mutationInitializeDecryptor?.isLoading}
          onClick={async () => await mutationInitializeDecryptor.mutateAsync()}
        >
          Activate decryptor
        </Button>
      </article>
    )
  }
  return (
    <LivepeerConfig theme={livepeerTheme} client={livepeerClient}>
      {publication?.isGated && mutationDecryptPublication?.isLoading && 'decrypting...'}
      <article className="animate-appear">
        <div className="prose w-full prose-invert">
          <Interweave
            {...rest}
            content={
              publication?.isGated && mutationDecryptPublication?.data?.decrypted?.content
                ? mutationDecryptPublication?.data?.decrypted?.content
                : mutationDecryptPublication?.data?.error?.errorCode === 'not_authorized'
                ? mutationDecryptPublication?.data?.error?.message
                : publication?.metadata?.content
            }
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
              if (media?.original?.mimeType?.includes('video') && i <= 0) {
                return (
                  <VideoPlayer
                    name={publication?.metadata?.name}
                    url={media?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
                  />
                )
              } else if (media?.original?.mimeType?.includes('audio'))
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
    </LivepeerConfig>
  )
}

export default LensPublicationContent
