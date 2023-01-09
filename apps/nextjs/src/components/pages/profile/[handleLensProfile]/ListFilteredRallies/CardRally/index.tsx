import Button from '@components/Button'
import { IconSpinner } from '@components/Icons'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { DICTIONARY_PROFILE_INTERESTS, DICTIONARY_PROFILE_INTERESTS_CATEGORIES } from '@helpers/mappingProfileInterests'
import { LockOpenIcon, PlayIcon } from '@heroicons/react/20/solid'
import useGetAudioChatPublishedRecording from '@hooks/useGetAudioChatPublishedRecording'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { formatRelative } from 'date-fns'
import Link from 'next/link'
import { useAccount } from 'wagmi'

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
  const account = useAccount()
  const {
    queryPublishedRecording,
    queryDecryptPublishedRecording,
    mutationDecryptMetadata,
    mutationSignDecryptMetadataMessage,
  } = useGetAudioChatPublishedRecording(data.id, data.recording_arweave_transaction_id)

  const setAudioPlayer = useAudioPlayer((state: any) => state.setAudioPlayer)
  const playedRally = useAudioPlayer((state: any) => state.rally)
  const stateVoiceChat: any = useStoreLiveVoiceChat()

  return (
    <article
      className={`flex flex-col bg-neutral-1 hover:bg-neutral-2 focus:bg-neutral-3 border-neutral-4 border p-6 rounded-xl h-full relative`}
    >
      <div className="flex-grow flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
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
        </div>
      </div>
      {DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label === data.state && (
        <div className={`pt-4 px-4 xs:px-0 gap-3 flex flex-col justify-center items-center`}>
          {data.will_be_recorded === false ? (
            <p className="italic text-neutral-11 text-sm">No recordings available.</p>
          ) : (
            <>
              {/* @ts-ignore */}
              {data?.recording_arweave_transaction_id === '' && (
                <p className="italic text-neutral-11 text-sm">The creator didn't publish any recording yet.</p>
              )}

              {/* @ts-ignore */}
              {queryPublishedRecording?.isLoading &&
                //@ts-ignore
                data?.recording_arweave_transaction_id !== '' && (
                  <div className="flex items-center justify-center space-i-1ex">
                    <IconSpinner className="text-[0.75rem] animate-spin" />
                    <p className="font-bold animate-pulse">Loading recording...</p>
                  </div>
                )}

              {queryPublishedRecording?.isSuccess && (
                <>
                  {queryPublishedRecording?.data?.recording_file ||
                  queryDecryptPublishedRecording?.data?.recording_file ? (
                    <>
                      <Button
                        disabled={stateVoiceChat?.room.state === 'connected' || playedRally?.id === data.id}
                        intent={
                          stateVoiceChat?.room.state === 'connected' || playedRally?.id === data.id
                            ? 'neutral-ghost'
                            : 'interactive-outline'
                        }
                        onClick={() => {
                          setAudioPlayer({
                            isOpen: true,
                            trackSrc:
                              queryPublishedRecording?.data?.recording_file ??
                              queryDecryptPublishedRecording?.data?.recording_file,
                            rally: {
                              clickedAt: new Date(),
                              timestamp: 0,
                              name: queryPublishedRecording?.data?.name ?? queryDecryptPublishedRecording?.data?.name,
                              imageSrc:
                                queryPublishedRecording?.data?.image ?? queryDecryptPublishedRecording?.data?.image,
                              id: data.id,
                              //@ts-ignore
                              lensPublicationId: data?.lens_publication_id,
                              metadata: queryPublishedRecording?.data ?? queryDecryptPublishedRecording?.data,
                            },
                          })
                        }}
                        scale="sm"
                        className="2xs:w-fit-content md:w-full lg:w-fit-content relative z-20 animate-appear !pis-2 !pie-3"
                      >
                        {playedRally?.id === data.id ? (
                          <>Playing</>
                        ) : (
                          <>
                            <PlayIcon className="w-5 mie-1ex" />
                            Play recording
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      {queryPublishedRecording?.data?.encrypted === true && !queryDecryptPublishedRecording?.data && (
                        <>
                          <div className="gap-2 flex flex-col w-full">
                            <p className="text-neutral-11 text-[0.75rem]">This recording is gated.</p>

                            <Button
                              disabled={
                                !account?.address ||
                                mutationDecryptMetadata?.isLoading ||
                                (mutationDecryptMetadata?.isSuccess && queryDecryptPublishedRecording?.isLoading)
                              }
                              isLoading={mutationDecryptMetadata?.isLoading}
                              onClick={async () => await mutationDecryptMetadata.mutateAsync()}
                              scale="sm"
                              intent="interactive-outline"
                              className={
                                '2xs:w-fit-content md:w-full lg:w-fit-content relative z-20 !pis-4 !pie-2 animate-appear'
                              }
                            >
                              {mutationDecryptMetadata?.isError || mutationSignDecryptMetadataMessage?.isError
                                ? 'Try again'
                                : mutationSignDecryptMetadataMessage
                                ? 'Decrypt'
                                : mutationDecryptMetadata?.isLoading
                                ? 'Decrypting...'
                                : mutationDecryptMetadata?.isSuccess &&
                                  //@ts-ignore
                                  mutationDecryptMetadata?.decryptedString &&
                                  queryDecryptPublishedRecording?.isLoading &&
                                  account?.address
                                ? 'Loading recording...'
                                : 'Decrypt'}
                              <LockOpenIcon className="mis-1ex w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
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
