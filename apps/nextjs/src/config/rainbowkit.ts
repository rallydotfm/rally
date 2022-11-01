import { midnightTheme } from '@rainbow-me/rainbowkit'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './../../tailwind.config.cjs'

//@ts-ignore
const tailwindTheme = resolveConfig(tailwindConfig).theme

export const theme = midnightTheme({
  //@ts-ignore
  accentColor: tailwindTheme?.colors.interactive[10],
  //@ts-ignore
  accentColorForeground: tailwindTheme.colors.white,
  //@ts-ignore
  fontStack: tailwindTheme?.fontFamily[0],
})
