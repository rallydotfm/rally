import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { polygonMumbai, polygon } from 'wagmi/chains'
import {
  okxWallet,
  safeWallet,
  tahoWallet,
  rabbyWallet,
  phantomWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets'

export const chainId = process?.env?.NEXT_PUBLIC_CHAIN === 'mumbai' ? polygonMumbai?.id : polygon?.id
export const { chains, provider } = configureChains(
  // for now we just want to support Mumbai testnet
  [polygonMumbai, polygon],
  // later on here we could add other providers
  // like Alchemy, Ankr, Infura...
  // eg: see https://wagmi.sh/docs/providers/alchemy
  [publicProvider(), alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string })],
)

const connectors = connectorsForWallets([
  {
    groupName: 'Suggested',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      phantomWallet({ chains }),
      safeWallet({ chains }),
      tahoWallet({ chains }),
      rabbyWallet({ chains }),
      okxWallet({ chains }),
      coinbaseWallet({ chains, appName: 'Rally' }),
    ],
  },
])

export const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
})

export const chainRPC = {
  [1]: 'https://rpc.ankr.com/eth',
  [56]: 'https://1rpc.io/bnb',
  [137]: 'https://rpc.ankr.com/polygon',
  [43114]: 'https://1rpc.io/avax/c',
  [42161]: 'https://1rpc.io/arb',
  [1284]: 'https://1rpc.io/glmr',
  [1285]: 'https://rpc.api.moonriver.moonbeam.network',
  [10]: 'https://1rpc.io/op',
  [250]: 'https://1rpc.io/ftm',
  [42220]: 'https://1rpc.io/celo',
  [100]: 'https://rpc.ankr.com/gnosis',
  [288]: 'https://mainnet.boba.network',
  [25]: 'https://evm.cronos.org',
  [1313161554]: 'https://mainnet.aurora.dev',
  [1088]: 'https://andromeda.metis.io/?owner=1088',
}
