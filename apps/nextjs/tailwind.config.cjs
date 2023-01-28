/** @type {import('tailwindcss').plugin} */
/** @type {import('tailwindcss').Config} */
/** @type { import('@radix-ui/colors') } */
const plugin = require('tailwindcss/plugin')
const colors = require('@radix-ui/colors')
const { greenDark, limeDark, grayDark, crimsonDark, plumDark } = colors
const typography = {
  fontSizeMin: 1.125,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
}

const screensRem = {
  min: 20,
  '2xs': 30,
  xs: 36,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 85.364,
}

const fsMin = typography.fontSizeMin
const fsMax = typography.fontSizeMax
const msFactorMin = typography.msFactorMin
const msFactorMax = typography.msFactorMax
const screenMin = screensRem.min
const screenMax = screensRem['2xl']

// Calc min and max font-size
const calcMulti = (multiMin = 0, multiMax = null) => {
  return {
    fsMin: fsMin * Math.pow(msFactorMin, multiMin),
    fsMax: fsMax * Math.pow(msFactorMax, multiMax || multiMin),
  }
}

// build the clamp property
const clamp = (multiMin = 0, multiMax = null) => {
  const _calcMulti = calcMulti(multiMin, multiMax || multiMin)
  const _fsMin = _calcMulti.fsMin
  const _fsMax = _calcMulti.fsMax
  return `clamp(${_fsMin}rem, calc(${_fsMin}rem + (${_fsMax} - ${_fsMin}) * ((100vw - ${screenMin}rem) / (${screenMax} - ${screenMin}))), ${_fsMax}rem)`
}

const remToPx = (rem) => {
  return `${rem * 16}px`
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      min: remToPx(screensRem.min),
      '2xs': remToPx(screensRem['2xs']),
      xs: remToPx(screensRem.xs),
      sm: remToPx(screensRem.sm),
      md: remToPx(screensRem.md),
      lg: remToPx(screensRem.lg),
      xl: remToPx(screensRem.xl),
      '2xl': remToPx(screensRem['2xl']),
      '3xl': remToPx(100),
    },
    fontFamily: {
      sans: ['"Satoshi", sans-serif'],
      mono: ['monospace'],
    },
    fontSize: {
      '3xs': clamp(-5),
      '2xs': clamp(-2),
      xs: clamp(-1.5),
      sm: clamp(-1.25),
      base: clamp(-1),
      md: clamp(0.125),
      lg: clamp(0.5),
      xl: clamp(1),
      '2xl': clamp(2),
      '3xl': clamp(3),
      '4xl': clamp(5),
    },
    fontVariationWidth: {
      125: 125,
      200: 200,
      250: 250,
      300: 300,
      400: 400,
      600: 600,
      800: 800,
      900: 900,
    },
    extend: {
      colors: {
        white: 'white',
        black: 'black',
        neutral: {
          1: grayDark.gray1,
          2: grayDark.gray2,
          3: grayDark.gray3,
          4: grayDark.gray4,
          5: grayDark.gray5,
          6: grayDark.gray6,
          7: grayDark.gray7,
          8: grayDark.gray8,
          9: grayDark.gray9,
          10: grayDark.gray10,
          11: grayDark.gray11,
          12: grayDark.gray12,
        },
        primary: {
          1: limeDark.lime1,
          2: limeDark.lime2,
          3: limeDark.lime3,
          4: limeDark.lime4,
          5: limeDark.lime5,
          6: limeDark.lime6,
          7: limeDark.lime7,
          8: limeDark.lime8,
          9: limeDark.lime9,
          10: limeDark.lime10,
          11: limeDark.lime11,
          12: limeDark.lime12,
        },
        interactive: {
          1: plumDark.plum1,
          2: plumDark.plum2,
          3: plumDark.plum3,
          4: plumDark.plum4,
          5: plumDark.plum5,
          6: plumDark.plum6,
          7: plumDark.plum7,
          8: plumDark.plum8,
          9: plumDark.plum9,
          10: plumDark.plum10,
          11: plumDark.plum11,
          12: plumDark.plum12,
        },
        negative: {
          1: crimsonDark.crimson1,
          2: crimsonDark.crimson2,
          3: crimsonDark.crimson3,
          4: crimsonDark.crimson4,
          5: crimsonDark.crimson5,
          6: crimsonDark.crimson6,
          7: crimsonDark.crimson7,
          8: crimsonDark.crimson8,
          9: crimsonDark.crimson9,
          10: crimsonDark.crimson10,
          11: crimsonDark.crimson11,
          12: crimsonDark.crimson12,
        },
        positive: {
          1: greenDark.green1,
          2: greenDark.green2,
          3: greenDark.green3,
          4: greenDark.green4,
          5: greenDark.green5,
          6: greenDark.green6,
          7: greenDark.green7,
          8: greenDark.green8,
          9: greenDark.green9,
          10: greenDark.green10,
          11: greenDark.green11,
          12: greenDark.green12,
        },
      },
      keyframes: {
        appear: {
          from: {
            opacity: 0,
            transform: 'translateY(5px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          from: {
            opacity: 0,
            transform: 'translateY(5px) scale(0.95)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },

        'scale-up': {
          '0%': { transform: 'scale(0.25)', opacity: 0 },
          '25%': { transform: 'scale(1.25)', opacity: 1 },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.25)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0 },
        },
      },
      animation: {
        appear: 'appear 300ms ease-in forwards',
        'scale-in': 'scale-in 250ms ease-in-out forwards',
        'scale-up': 'scale-up 2350ms ease-in-out alternate forwards',
      },
      height: {
        'fit-content': 'fit-content',
      },
      width: ({ theme }) => ({
        ...theme('screens'),
        'max-content': 'max-content',
        'fit-content': 'fit-content',
        'min-content': 'min-content',
      }),
      maxWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      minWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      opacity: {
        2.5: '0.025',
        3.5: '0.035',
        7.5: '0.075',
        15: '0.15',
      },
      spacing: {
        '1ex': '1ex',
      },
      aspectRatio: {
        'twitter-card': '2 / 1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities, theme, e }) => {
      const values = theme('fontVariationWidth')
      var utilities = Object.entries(values).map(([key, value]) => {
        return {
          [`.${e(`font-variation-width-${key}`)}`]: { 'font-variation-settings': `'wdth' ${value}` },
        }
      })
      addUtilities(utilities)
    }),
    require('vidstack/tailwind.cjs'),
    require('@headlessui/tailwindcss'),
    require('tailwindcss-logical'),
    require('@tailwindcss/typography'),
  ],
}
