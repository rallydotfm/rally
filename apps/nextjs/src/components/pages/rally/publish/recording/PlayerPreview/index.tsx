import { PauseIcon, PlayIcon, PlayPauseIcon } from '@heroicons/react/20/solid'
import { Audio, Media, PlayButton, Time } from '@vidstack/react'

export const PlayerPreview = (props: any) => {
  const { src } = props

  return (
    <>
      <Media className="w-full relative z-10 flex flex-col">
        <Audio>
          <audio src={src} preload="none" />
        </Audio>

        <PlayButton
          title="Toggle play"
          className="flex flex-col text-neutral-12 w-full justify-center gap-1 items-center"
        >
          <PlayPauseIcon className="pointer-events-none hover:opacity-90 w-4 hidden media-playing:hidden media-can-play:block media-paused:hidden" />
          <PlayIcon className="pointer-events-none hover:opacity-90 w-4 hidden media-playing:hidden media-can-play:hidden media-paused:block" />
          <PauseIcon className="pointer-events-none hover:opacity-90 w-4 hidden media-playing:block media-can-play:hidden media-paused:hidden" />
        </PlayButton>
      </Media>
    </>
  )
}

export default PlayerPreview
