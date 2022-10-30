// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import { trpc } from '@utils/trpc'
import Head from 'next/head'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import queryClient from '@config/react-query'
import { wagmiClient, chains } from '@config/wagmi'
import { getLayout as getBaseLayout } from '@layouts/LayoutBase'
import '@styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { theme } from '@config/rainbowkit'

function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout ?? getBaseLayout

  return (
    <>
      <Head>
        <meta name="color-scheme" content="dark" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={theme} chains={chains}>
            {getLayout(<Component {...pageProps} />)}
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
