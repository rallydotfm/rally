import { ROUTE_RALLY_VIEW } from '@config/routes'
import {
  PauseIcon,
  PlayIcon,
  PlayPauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
} from '@heroicons/react/20/solid'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { MediaSeekedEvent, MediaSeekingEvent } from '@vidstack/player'
import {
  Audio,
  Media,
  MuteButton,
  PlayButton,
  Time,
  SliderValueText,
  TimeSlider,
  VolumeSlider,
  useMediaContext,
  useMediaRemote,
} from '@vidstack/player-react'
import Link from 'next/link'
import { useRef } from 'react'

export const ToolbarAudioPlayer = () => {
  const trackSrc = useAudioPlayer((state) => state.trackSrc)
  const rally = useAudioPlayer((state) => state.rally)
  const setAudioPlayer = useAudioPlayer((state) => state.setAudioPlayer)
  const media = useRef(null)

  return (
    <>
      <Media ref={media} className="w-full flex flex-col">
        <Audio autoplay={true}>
          <audio src={trackSrc} preload="none" />
        </Audio>

        <div className="px-3 pb-3 gap-3 flex items-center flex-col">
          <div className="w-full max-w-screen-2xs mx-auto">
            <div className="flex justify-between items-center text-[0.725rem] gap-4">
              <Time type="current" />
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

            <PlayButton title="Toggle play">
              <PlayPauseIcon className="w-6 media-playing:hidden media-can-play:block media-paused:hidden" />
              <PlayIcon className="w-6 media-playing:hidden media-can-play:hidden media-paused:block" />
              <PauseIcon className="w-6 media-playing:block media-can-play:hidden media-paused:hidden" />
              <span className="sr-only">Toggle play</span>
            </PlayButton>
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
    </>
  )
}

export default ToolbarAudioPlayer
