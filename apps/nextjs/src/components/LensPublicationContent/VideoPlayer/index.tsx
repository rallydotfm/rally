import { Player } from '@livepeer/react'
import { useMemo } from 'react'
import { parseArweaveTxId, parseCid } from 'livepeer/media'
import { IconSpinner } from '@components/Icons'
interface VideoPlayerProps {
  url: string
  name: string
}
export const VideoPlayer = (props: VideoPlayerProps) => {
  const { url, name } = props
  const idParsed = useMemo(() => parseCid(url) ?? parseArweaveTxId(url), [url])
  if (idParsed)
    return (
      <div className="animate-appear max-w-prose">
        <Player
          title={name}
          src={url}
          autoPlay={false}
          autoUrlUpload={{ fallback: true, ipfsGateway: 'https://w3s.link' }}
        />
      </div>
    )
  return (
    <div className="my-6 flex items-center justify-center space-i-1ex">
      <IconSpinner className="text-lg animate-spin" />
      <p className="font-bold animate-pulse">Loading video...</p>
    </div>
  )
}
export default VideoPlayer
