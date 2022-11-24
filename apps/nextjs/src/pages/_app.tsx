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
import { Toaster } from 'react-hot-toast'
import { toastOptions } from '@config/react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { getSiweMessageOptions } from '@config/siwe'

function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout ?? getBaseLayout

  return (
    <>
      <Head>
        <meta name="color-scheme" content="dark" />
        <link rel="preload" href="/Satoshi-Variable.ttf" as="font" type="font/ttf" />
        <link rel="preload" href="/Satoshi-VariableItalic.ttf" as="font" type="font/ttf" />
      </Head>
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <SessionProvider refetchInterval={0} session={pageProps?.session}>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
              <RainbowKitProvider theme={theme} chains={chains}>
                {getLayout(<Component {...pageProps} />)}
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </WagmiConfig>
        </SessionProvider>
      </QueryClientProvider>
      {/* @ts-ignore */}
      <Toaster position="top-right" toastOptions={toastOptions} />
    </>
  )
}

export default trpc.withTRPC(MyApp)
