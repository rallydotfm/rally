import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

export const { chains, provider } = configureChains(
  // for now we just want to support Mumbai testnet
  [chain.polygonMumbai],
  // later on here we could add other providers
  // like Alchemy, Ankr, Infura...
  // eg: see https://wagmi.sh/docs/providers/alchemy
  [publicProvider()],
)

const { wallets } = getDefaultWallets({
  appName: 'Rally',
  chains,
})

const connectors = connectorsForWallets([...wallets])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})
