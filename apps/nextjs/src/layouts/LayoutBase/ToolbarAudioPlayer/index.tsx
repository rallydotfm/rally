import DialogCommentRecording from '@layouts/LayoutBase/ToolbarAudioPlayer/DialogCommentRecording'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import {
  ChatBubbleLeftRightIcon,
  PauseIcon,
  PlayIcon,
  PlayPauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
} from '@heroicons/react/20/solid'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import {
  Audio,
  Media,
  MuteButton,
  PlayButton,
  Time,
  SliderValueText,
  TimeSlider,
  useMediaContext,
} from '@vidstack/player-react'
import Link from 'next/link'
import { useRef } from 'react'
import { useStoreTxUiCommentRecording } from '@hooks/useCommentRecording'
import { useAccount } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useMountEffect, useUnmountEffect, useUpdateEffect } from '@react-hookz/web'

export const ToolbarAudioPlayer = () => {
  const trackSrc = useAudioPlayer((state) => state.trackSrc)
  const setIsReady = useAudioPlayer((state) => state.setIsReady)
  const rally: any = useAudioPlayer((state) => state.rally)
  const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)
  const media = useRef(null)
  const isCommentDialogVisible = useStoreTxUiCommentRecording((state) => state.isDialogVisible)
  const setIsCommentDialogVisible = useStoreTxUiCommentRecording((state) => state.setDialogVisibility)
  const lensPublicationId = useStoreTxUiCommentRecording((state) => state.lensPublicationId)
  const selectPublicationToComment = useStoreTxUiCommentRecording((state) => state.selectPublicationToComment)
  const timestamp = useStoreTxUiCommentRecording((state) => state.timestamp)
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const audioPlayer = useMediaContext(media)
  const goToTimestampRef = useRef(null)
  useUpdateEffect(() => {
    if (rally?.timestamp) {
      //@ts-ignore
      goToTimestampRef?.current?.click()
    }
  }, [rally?.timestamp, rally?.clickedAt])

  useUnmountEffect(() => {
    setIsReady(false)
  })

  useMountEffect(() => {
    setIsReady(true)
  })
  return (
    <>
      <Media className="w-full flex flex-col">
        <button
          ref={goToTimestampRef}
          className="sr-only"
          onClick={() => {
            //@ts-ignore
            media?.current?.dispatchEvent(
              new CustomEvent('vds-seek-request', { detail: rally?.timestamp, bubbles: true, composed: true }),
            )
          }}
        >
          Go to time: {rally?.timestamp}
        </button>
        <Audio
          onVdsCanPlayThrough={() => {
            if (rally?.timestamp !== 0) {
              //@ts-ignore
              media.current.dispatchEvent(
                new CustomEvent('vds-seek-request', { detail: rally?.timestamp, bubbles: true, composed: true }),
              )
            }
          }}
          onVdsCanPlay={() => {
            if (rally?.timestamp !== 0) {
              //@ts-ignore
              media.current.dispatchEvent(
                new CustomEvent('vds-seek-request', { detail: rally?.timestamp, bubbles: true, composed: true }),
              )
            } else {
              //@ts-ignore
              media.current.dispatchEvent(
                new CustomEvent('vds-play-request', { detail: rally?.timestamp, bubbles: true, composed: true }),
              )
            }
          }}
          onVdsSeeked={() => {
            //@ts-ignore
            media.current.dispatchEvent(
              new CustomEvent('vds-play-request', { detail: rally?.timestamp, bubbles: true, composed: true }),
            )
          }}
          ref={media}
        >
          <audio src={trackSrc} preload="none" />
        </Audio>

        <div className="px-3 pb-3 gap-3 flex items-center flex-col">
          <div className="w-full max-w-screen-2xs mx-auto">
            <div className="flex justify-between items-center text-[0.725rem] gap-4">
              <Time className="text-interactive-11 font-medium" type="current" />
              <TimeSlider className="group transition-all w-full relative h-1.5">
                <div className="rounded-full w-full h-full bg-interactive-3" />
                <div
                  className={`rounded-full transition-all absolute top-0 h-full inline-start-0 w-[var(--vds-fill-percent)] bg-interactive-9 hover:bg-interactive-11 focus:bg-interactive-10`}
                />
                <div className="w-3.5 h-3.5 transition-all absolute inline-start-[var(--vds-fill-percent)] top-1/2 -translate-y-1/2 rounded-full bg-neutral-12">
                  <div className="slider-thumb" />
                </div>

                <span className="leading-none opacity-0 group-focus:opacity-100 group-hover:opacity-100 py-1 absolute text-[0.725rem] bg-interactive-4 font-medium  px-1.5 rounded-md text-interactive-12 -translate-x-1/2 inline-start-[var(--vds-pointer-percent)] top-0 -translate-y-[calc(100%+0.45rem)] z-10">
                  <SliderValueText type="pointer" format="time" />
                </span>
              </TimeSlider>
              <Time type="duration" />
            </div>
          </div>
          <div className="flex w-full justify-between xs:justify-center gap-8 xs:gap-12 items-center">
            <button
              onClick={() =>
                setAudioPlayer({
                  isOpen: false,
                  rally: undefined,
                  trackSrc: undefined,
                })
              }
              title="Stop and close player"
            >
              <StopIcon className="w-5 text-neutral-11 hover:text-neutral-12 focus:text-white" />
              <span className="sr-only">Stop and close audio player</span>
            </button>
            <div className="flex items-baseline gap-6">
              <PlayButton title="Toggle play">
                <PlayPauseIcon className="w-6 media-playing:hidden media-can-play:block media-paused:hidden" />
                <PlayIcon className="w-6 media-playing:hidden media-can-play:hidden media-paused:block" />
                <PauseIcon className="w-6 media-playing:block media-can-play:hidden media-paused:hidden" />
                <span className="sr-only">Toggle play</span>
              </PlayButton>
              {rally?.lensPublicationId && (
                <button
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !isSignedIn ||
                    !account?.address ||
                    (isSignedIn && !queryUserProfileLens?.data?.id) ||
                    queryUserProfileLens?.data?.ownedBy !== account?.address
                  }
                  onClick={() => {
                    selectPublicationToComment(
                      //@ts-ignore
                      rally?.lensPublicationId as string,
                      new Date(audioPlayer.currentTime * 1000).toISOString().slice(11, 19),
                    )
                  }}
                  type="button"
                >
                  <ChatBubbleLeftRightIcon className="w-5" />
                </button>
              )}
            </div>

            <MuteButton className="text-neutral-11 hover:text-neutral-12 focus:text-white">
              <SpeakerWaveIcon className="w-5 hidden media-muted:block " />
              <SpeakerXMarkIcon className="w-5 media-muted:hidden block" />
              <span className="sr-only">Toggle mute audio</span>
            </MuteButton>
          </div>
          {/* @ts-ignore */}
          <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', rally?.id)}>
            <a className="text-[0.775rem] font-medium text-interactive-12">
              <span className="sr-only">Now playing:</span> {rally?.name}
            </a>
          </Link>
        </div>
      </Media>
      {isCommentDialogVisible === true && (
        <DialogCommentRecording
          stateTxUi={{
            timestamp,
            idLensPublication: lensPublicationId,
            isDialogVisible: isCommentDialogVisible,
            setDialogVisibility: setIsCommentDialogVisible,
          }}
        />
      )}
    </>
  )
}

export default ToolbarAudioPlayer
