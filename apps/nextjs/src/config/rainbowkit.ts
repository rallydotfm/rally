import { midnightTheme } from '@rainbow-me/rainbowkit'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './../../tailwind.config.cjs'

const tailwindTheme = resolveConfig(tailwindConfig).theme

export const theme = midnightTheme({
  accentColor: tailwindTheme?.colors.interactive[10],
  accentColorForeground: tailwindTheme.colors.white,
  fontStack: tailwindTheme?.fontFamily[0],
})
