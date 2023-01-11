import { useRef } from 'react'
import { Audio, Media, MuteButton, PlayButton, Time, SliderValueText, TimeSlider } from '@vidstack/player-react'
import { PlayPauseIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import EthereumAddress from '@components/EthereumAddress'

export const AudioPlayer = (props: any) => {
  const { publication } = props
  const media = useRef(null)
  return (
    <div className="w-full flex gap-6 p-3 bg-interactive-2 rounded-md">
      {publication?.metadata?.image !== null ||
        (publication?.metadata?.attributes?.filter((attr: any) => attr?.traitType === 'thumbnail')?.[0]?.value && (
          <div className="shrink-0 aspect-square rounded-md">
            <img
              src={
                publication?.metadata?.image !== null
                  ? publication?.metadata?.image.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
                  : publication?.metadata?.attributes
                      ?.filter((attr: any) => attr?.traitType === 'thumbnail')?.[0]
                      ?.value.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
              }
            />
          </div>
        ))}
      <div className="grow">
        <p className="text-sm font-bold">
          {publication?.metadata?.name ??
            publication?.metadata?.attributes?.filter((attr: any) => attr?.traitType === 'title')?.[0]?.value}
        </p>
        <p className="text-xs font-medium mt-1">by {publication?.profile?.name}</p>
        <Media className="w-full">
          <Audio ref={media}>
            <audio
              src={
                publication?.metadata?.media?.[0]?.original?.url?.replace(
                  'ipfs://',
                  'https://lens.infura-ipfs.io/ipfs/',
                ) ??
                publication?.metadata?.attributes
                  ?.filter((attr: any) => attr?.traitType === 'track')?.[0]
                  ?.value.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
              }
              preload="none"
            />
          </Audio>
          <div className="flex gap-2 pb-6 flex-col">
            <span className="flex text-[0.75rem] justify-between">
              <Time className="text-interactive-11 font-medium" type="current" />
              <Time type="duration" />
            </span>
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
          </div>
          <div className="flex gap-6 justify-between">
            <PlayButton title="Toggle play">
              <PlayPauseIcon className="w-6 media-playing:hidden media-can-play:block media-paused:hidden" />
              <PlayIcon className="w-6 media-playing:hidden media-can-play:hidden media-paused:block" />
              <PauseIcon className="w-6 media-playing:block media-can-play:hidden media-paused:hidden" />
              <span className="sr-only">Toggle play</span>
            </PlayButton>{' '}
            <MuteButton className="text-neutral-11 hover:text-neutral-12 focus:text-white">
              <SpeakerWaveIcon className="w-5 hidden media-muted:block " />
              <SpeakerXMarkIcon className="w-5 media-muted:hidden block" />
              <span className="sr-only">Toggle mute audio</span>
            </MuteButton>
          </div>
        </Media>
      </div>
    </div>
  )
}

export default AudioPlayer
