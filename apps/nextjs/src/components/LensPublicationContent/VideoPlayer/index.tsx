import { LivepeerConfig, ThemeConfig, createReactClient, studioProvider } from '@livepeer/react'
import { Player } from '@livepeer/react'
import { parseArweaveTxId, parseCid } from 'livepeer/media'
import { useMemo } from 'react'

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
  }),
})

const theme: ThemeConfig = {
  colors: {
    accent: 'rgb(0, 145, 255)',
    containerBorderColor: 'rgba(0, 145, 255, 0.9)',
  },
  fonts: {
    display: 'Inter',
  },
}

export const VideoPlayer = (props) => {
  const { url } = props
  const idParsed = useMemo(() => parseCid(url) ?? parseArweaveTxId(url), [url])

  return (
    <LivepeerConfig client={livepeerClient} theme={theme}>
      <Player
        title="Waterfalls"
        playbackId={idParsed}
        showPipButton
        showTitle={false}
        aspectRatio="16to9"
        controls={{
          autohide: 3000,
        }}
        theme={{
          borderStyles: { containerBorderStyle: 'hidden' },
          radii: { containerBorderRadius: '10px' },
        }}
      />
    </LivepeerConfig>
  )
}
export default VideoPlayer
