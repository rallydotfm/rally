// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import { trpc } from '@utils/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import queryClient from '@config/react-query'
import { wagmiClient, chains } from '@config/wagmi'
import { getLayout as getBaseLayout } from '@layouts/LayoutBase'
import '@styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout ?? getBaseLayout

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>{getLayout(<Component {...pageProps} />)}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default trpc.withTRPC(MyApp)
