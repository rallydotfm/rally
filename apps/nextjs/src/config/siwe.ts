import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'

export const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign this message to verify your wallet and start using Rally.',
})
