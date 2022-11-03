// @ts-ignore
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './../../tailwind.config.cjs'

//@ts-ignore
const tailwindTheme = resolveConfig(tailwindConfig).theme

export const toastOptions = {
  style: {
    //@ts-ignore
    fontWeight: tailwindTheme.fontWeight.bold,
    //@ts-ignore
    fontSize: tailwindTheme.fontSize['xs'],
    //@ts-ignore
    borderRadius: tailwindTheme.borderRadius['md'],
    //@ts-ignore
    padding: tailwindTheme.padding[1],
    //@ts-ignore
    paddingInlineStart: tailwindTheme.padding[1.5],
  },
  blank: {
    style: {
      //@ts-ignore
      backgroundColor: tailwindTheme.colors.neutral[12],
      //@ts-ignore
      color: tailwindTheme.colors.black,
      //@ts-ignore
      borderColor: tailwindTheme.colors.neutral[4],
      //@ts-ignore
      borderWidth: '1px',
      //@ts-ignore
      borderStyle: 'solid',
    },
  },
  success: {
    style: {
      //@ts-ignore
      backgroundColor: tailwindTheme.colors.positive[12],
      //@ts-ignore

      color: tailwindTheme.colors.positive[1],
    },
  },
  error: {
    iconTheme: {
      //@ts-ignore
      primary: tailwindTheme.colors.negative[9],
    },
    style: {
      //@ts-ignore
      backgroundColor: tailwindTheme.colors.negative[12],
      //@ts-ignore
      color: tailwindTheme.colors.negative[1],
    },
  },
}
