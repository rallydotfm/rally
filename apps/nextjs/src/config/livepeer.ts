import { ThemeConfig, createReactClient, studioProvider } from '@livepeer/react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './../../tailwind.config.cjs'

//@ts-ignore
const tailwindTheme = resolveConfig(tailwindConfig).theme

export const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
  }),
})

export const livepeerTheme: ThemeConfig = {
  colors: {
    accent: tailwindTheme?.colors.interactive[10],
    containerBorderColor: tailwindTheme?.colors.interactive[4],
  },
}
